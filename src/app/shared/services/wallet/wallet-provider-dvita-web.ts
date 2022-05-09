import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIService } from '@app/shared/services/api.service';
import { WebWalletStorageService } from '@app/shared/services/web-wallet-storage.service';
import { tx, u, wallet } from '@cityofzion/neon-core';
import { AnnounceTXParams, WalletInfo, WalletProvider } from './types';
import { WalletProviderDvitaWebPopupConfirmComponent } from './wallet-provider-dvita-web-popup-confirm.component';
import { WalletProviderDvitaWebPopupDestroyComponent } from './wallet-provider-dvita-web-popup-destroy.component';
import { WalletProviderDvitaWebPopupImportComponent } from './wallet-provider-dvita-web-popup-import.component';
import { WalletProviderDvitaWebPopupUnlockComponent } from './wallet-provider-dvita-web-popup-unlock.component';

const MAGIC_NUMBER_TESTNET = 199;

@Injectable({ providedIn: 'root' })
export class WalletProviderDvitaWeb implements WalletProvider {
  private wallet: wallet.Account | null = null;

  constructor(
    private readonly apiService: APIService,
    private readonly webWalletStorageService: WebWalletStorageService,
    private readonly dialog: MatDialog
  ) {
    this.wallet = webWalletStorageService.getWallet();
  }

  private confirm(readableTransactionJSON: object): Promise<void> {
    return this.walletUnlocked(
      'Your wallet must be unlocked to perform a blockchain transaction.<br />You will confirm the transaction in the next step.'
    ).then(
      () =>
        new Promise(resolve => {
          if (!this.wallet) {
            throw new Error('Please log in first');
          }
          const dialogRef = this.dialog.open(WalletProviderDvitaWebPopupConfirmComponent, {
            data: {
              readableTransactionJSON,
              signerAddress: this.wallet.address,
            },
          });
          dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
              resolve();
            } else {
              throw new Error('User did NOT confirm transaction');
            }
          });
        })
    );
  }

  async connectWallet(): Promise<WalletInfo> {
    this.wallet = this.webWalletStorageService.getWallet();
    if (!this.wallet) {
      throw new Error('Can not connect wallet, there is no wallet 🤷');
    }
    return {
      providerName: 'dvita-web',
      account: {
        address: this.wallet.address,
      },
    };
  }

  private isLocked(): boolean {
    try {
      return !(this.wallet && this.wallet.privateKey);
    } catch (err) {
      return true;
    }
  }

  private walletUnlocked(message: string): Promise<void> {
    if (!this.isLocked()) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const dialogRef = this.dialog.open(WalletProviderDvitaWebPopupUnlockComponent, {
        data: {
          wallet: this.wallet,
          message,
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          resolve();
        } else {
          reject(new Error('User did NOT unlock wallet'));
        }
      });
    });
  }

  async getPublicKey(): Promise<string> {
    if (!this.wallet) {
      throw new Error('Please log in first');
    }
    await this.walletUnlocked(
      'Your wallet must be unlocked to vote.<br />You will confirm the vote transaction in the next step.'
    );
    return wallet.getPublicKeyFromPrivateKey(this.wallet.privateKey);
  }

  ready(): Promise<WalletProvider> {
    return Promise.resolve(this);
  }

  signMessage(messageToSign: string): Promise<{ publicKey: string; salt: string; data: string }> {
    if (!this.wallet) {
      throw new Error('Please log in first');
    }
    const randomSalt = randomBytesToHexString(16);
    const publicKey = wallet.getPublicKeyFromPrivateKey(this.wallet.privateKey);
    const hex = u.str2hexstring(randomSalt + messageToSign);
    const lengthHex = u.num2VarInt(hex.length / 2);
    const messageGuaranteedToNotBeTx = '010001f0' + lengthHex + hex + '0000';
    return Promise.resolve({
      publicKey,
      data: wallet.sign(messageGuaranteedToNotBeTx, this.wallet.privateKey),
      salt: randomSalt,
    });
  }

  decrypt(password: string): Promise<void> {
    if (!this.wallet) {
      throw new Error('Please log in first');
    }
    return this.wallet.decrypt(password).then(() => {});
  }

  export(): void {
    if (!this.wallet) {
      throw new Error('Please log in first');
    }
    const walletObj = new wallet.Wallet();
    walletObj.addAccount(this.wallet);
    download('my_dvita_wallet.json', JSON.stringify(walletObj.export(), null, 2));
  }

  destroy(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dialogRef = this.dialog.open(WalletProviderDvitaWebPopupDestroyComponent, {
        data: {
          export: () => this.export(),
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          resolve();
        } else {
          reject(new Error('Wallet NOT destroyed because user did NOT confirm'));
        }
      });
    }).then(() => {
      if (!this.wallet) {
        throw new Error('No wallet to delete');
      }
      this.webWalletStorageService.deleteWallet(this.wallet.address);
    });
  }

  async signAndAnnounceTx(params: AnnounceTXParams): Promise<{ txid: string }> {
    const { txInstance, ...rest } = params;
    if (!this.wallet) {
      throw new Error('Please log in first');
    }
    await this.confirm(rest);
    txInstance.sign(this.wallet.privateKey, MAGIC_NUMBER_TESTNET);
    return this.broadcast(txInstance);
  }

  async signTx(txInstance: tx.Transaction): Promise<string> {
    if (!this.wallet) {
      throw new Error('Please log in first');
    }
    await this.walletUnlocked('Your wallet must be unlocked to sign this transaction.');
    const newTx = tx.Transaction.deserialize(txInstance.serialize(true)); // create a copy to avoid mutating argument
    newTx.sign(this.wallet.privateKey, MAGIC_NUMBER_TESTNET);
    return newTx.serialize(true);
  }

  async invoke(params: Parameters<typeof tx.Transaction.fromJson>[0]): Promise<{ txid: string }> {
    if (!this.wallet) {
      throw new Error('Please log in first');
    }
    await this.confirm(params);
    const txn = tx.Transaction.fromJson(params);
    txn.sign(this.wallet.privateKey, MAGIC_NUMBER_TESTNET);
    return this.broadcast(txn);
  }

  async createWallet({ email, password }: { email: string; password: string }): Promise<void> {
    const privateKey = wallet.generatePrivateKey();
    this.wallet = new wallet.Account(privateKey);
    await this.wallet.encrypt(password);
    const walletJSON = this.wallet.export();
    this.webWalletStorageService.saveWallet({ email, walletJSON });
  }

  importWalletJSON(json: string): void {
    const walletObj = new wallet.Wallet(JSON.parse(json));
    const account = walletObj.accounts[0];
    this.wallet = account;
    this.webWalletStorageService.saveWallet({ email: '', walletJSON: account.export() });
  }

  importPrivateKey(): Promise<void> {
    return new Promise<void>(resolve => {
      const dialogRef = this.dialog.open(WalletProviderDvitaWebPopupImportComponent);
      dialogRef.afterClosed().subscribe((account?: wallet.Account) => {
        if (!account) {
          throw new Error('User canceled wallet import');
        }
        this.wallet = account;
        this.webWalletStorageService.saveWallet({ email: '', walletJSON: account.export() });
        resolve();
      });
    });
  }

  private broadcast(txn: tx.Transaction): Promise<{ txid: string }> {
    return this.apiService.broadcast(txn.serialize(true)).then(resp => {
      if (resp.status === 'ANNOUNCED') {
        return { txid: resp.transaction.hash };
      } else {
        throw new Error(resp.error);
      }
    });
  }
}

function randomBytesToHexString(bytes: number): string {
  // https://stackoverflow.com/a/60738723/1860900
  return [...crypto.getRandomValues(new Uint8Array(bytes))].map(m => ('0' + m.toString(16)).slice(-2)).join('');
}

function download(filename: string, text: string): void {
  // https://stackoverflow.com/a/18197341/1860900
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
