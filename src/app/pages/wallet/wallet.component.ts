import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService, Network, UserInfo } from '@app/shared/services/api.service';
import { AuthService, User } from '@app/shared/services/auth.service';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { TransactionService } from '@app/shared/services/transaction.service';
import { WalletPluginService } from '@app/shared/services/wallet/wallet.plugin.service';
import Decimal from 'decimal.js';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { generateImage } from './generateImage';

export interface AssetData {
  icon: string;
  name: string;
  type: string;
  hash?: string;
  amount: string;
  decimals: string;
}

export interface TransactionData {
  icon: 'user' | 'send' | 'box';
  type: 'Transfer in' | 'Transfer out';
  transactionId: string;
  amount: string;
  completedOn: string;
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  assetsList: AssetData[] = [];
  assetsDisplayedColumns = ['name', 'type', 'amount'];
  assetsDataSource = new MatTableDataSource(this.assetsList);
  @ViewChild(MatSort) assetsSort!: MatSort;

  transactions: TransactionData[] = [];
  transactionsDisplayedColumns: string[] = ['type', 'transactionId', 'amount', 'completedOn'];
  transactionsDataSource = new MatTableDataSource(this.transactions);
  @ViewChild(MatSort) transactionsSort!: MatSort;

  @ViewChild('settingsSection') settingsSection!: ElementRef;

  net: Network = this.apiService.getNetwork();
  user: User | null = null;
  address = '';
  amountDVITA = String(0);
  amountDVG = String(0);
  assetNames: { name: string }[] = [];
  transferAssetMaximum = '';
  transferModel = {
    recipient: '',
    amount: '',
    asset: '',
  };
  loading = true;
  paginator = {
    dataLength: 0,
    pageSizeOption: [10, 15, 30, 50],
    pageSize: 10,
  };
  userInfo?: UserInfo = undefined;
  userInfoFetching = false;

  private allTransactions: TransactionData[] = [];
  authToken?: string = undefined;
  private twitterAuthWindow: WindowProxy | null = null;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly apiService: APIService,
    private readonly sanitizer: DomSanitizer,
    private readonly walletPluginService: WalletPluginService,
    private readonly transactionService: TransactionService,
    private readonly snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.authService.userObservable.subscribe(user => (this.user = user));

    const wsUrl = environment.wsURL(this.apiService.getNetwork());
    // TODO: Reconnect when server disconnected suddenly. To start resilience flow.
    const subject = webSocket(wsUrl);
    subject.subscribe(
      (msg: any) => {
        console.debug(`WS: Got message: ${JSON.stringify(msg)}`);
        const msgJsonString = JSON.stringify(msg);
        if (JSON.parse(msgJsonString).loginStatus === 'Ok') {
          this.setTwitterUsername();
        }
      },
      (err: Error) => {
        console.error(err);
      },
      () => {
        console.log('Websocket connection complete');
      }
    );

    this.route.paramMap.subscribe(async params => {
      const address = params.get('address');
      if (!address) {
        console.warn('No wallet address in URL, redirecting');
        const user = this.authService.user;
        const target = user ? `/wallet/${user.wallet.account.address}` : '/login';
        this.router.navigateByUrl(target);
        return;
      }
      this.address = address;
    });

    this.apiService.getNetworkObservable().subscribe(net => {
      this.net = net;
      if (this.address) {
        this.fetchAndUpdate();
      }
    });
  }

  onLogOutClick(): void {
    this.authService.logOut();
  }

  onSettingsClick(): void {
    this.settingsSection.nativeElement.scrollIntoView();
  }

  onExportClick(): void {
    this.walletPluginService.export();
  }

  onDestroyClick(): void {
    this.walletPluginService
      .destroy()
      .then(() => this.authService.logOut())
      .catch(err => console.warn('message' in err ? err.message : err));
  }

  get isWebWallet(): boolean {
    return !!(this.user && this.user.wallet.providerName === 'dvita-web');
  }

  isMyWallet(): boolean {
    return !!(this.user && this.address && this.user.wallet.account.address === this.address);
  }

  onSelectTransferAsset(asset: string): void {
    this.transferModel.asset = asset;
    this.transferAssetMaximum = this.assetsList.find(a => a.name === asset)?.amount ?? '';
  }

  onMaxClick(): void {
    this.transferModel.amount = this.transferAssetMaximum;
  }

  onRequestTestNetFundsClick(): void {
    if (!this.address) {
      return;
    }

    this.loading = true;
    this.apiService
      .requestTestFunds(this.address)
      .then(txs => {
        this.snackBarService.show('Funds requested successfully');
        if (txs.length > 0) {
          this.apiService.waitUntilTransactionCofirmed(txs[0].transaction.hash).then(() => this.fetchAndUpdate());
        }
      })
      .catch(err => {
        console.error(err);
        this.snackBarService.show('Failed to request funds');
        this.loading = false;
      });
  }

  navigateTo(row: TransactionData): void {
    this.router.navigateByUrl(`/transactions/${row.transactionId}`);
  }

  pageChange(page: { pageIndex: number; pageSize: number }): void {
    this.transactions = this.allTransactions.slice(
      (page.pageIndex - 1) * page.pageSize,
      page.pageIndex * page.pageSize
    );
    this.transactionsDataSource = new MatTableDataSource(this.transactions);
    this.transactionsDataSource.sort = this.transactionsSort;
  }

  copy(text: string): void {
    navigator.clipboard
      .writeText(String(text))
      .then(() => this.snackBarService.show('Copied'))
      .catch(() => this.snackBarService.show('Could not copy, please do it manually'));
  }

  copyPublicKey(): void {
    if (!this.user) {
      throw new Error('Please log in first');
    }

    this.walletPluginService.getPublicKey(this.user.wallet.providerName).then(pubKey => this.copy(pubKey));
  }

  async onTransfer(event: { srcElement: EventTarget | null }): Promise<void> {
    if (!this.user) {
      this.snackBarService.show('Please log in first');
      return;
    }

    const recipient = this.transferModel.recipient;
    if (!recipient) {
      this.snackBarService.show('Please enter recipient address');
      return;
    }

    const amount = this.transferModel.amount;
    if (!amount) {
      this.snackBarService.show('Please enter amount');
      return;
    }

    const assetName = this.transferModel.asset;
    if (!assetName) {
      this.snackBarService.show('Please specify asset');
      return;
    }

    const asset = this.assetsList.find(a => a.name === assetName);
    if (!asset || !asset.hash) {
      this.snackBarService.show('Asset not found');
      return;
    }

    const amountToTransfer = new Decimal(amount).mul(new Decimal(10).pow(asset.decimals));
    const addressResolutionResult = await this.apiService.cnrResolve(recipient);
    const txToSign = await this.transactionService.createTransfer(
      this.address,
      addressResolutionResult.address,
      asset.hash,
      amountToTransfer.toString()
    );
    this.walletPluginService
      .signAndAnnounceTx(this.user.wallet.providerName, txToSign)
      .then(({ txid }) => {
        this.snackBarService.show('Transaction announced');
        this.loading = true;
        this.apiService.waitUntilTransactionCofirmed(txid).then(() => this.fetchAndUpdate());
        this.transferModel = {
          recipient: '',
          amount: '',
          asset: '',
        };
      })
      .catch(err => {
        this.snackBarService.show(err.message ?? String(err));
      });
  }

  async onSubmitAccountInfo(event: { target: EventTarget | null }): Promise<void> {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const jsonRaw: Record<string, FormDataEntryValue> = {};
    formData.forEach((value, key) => {
      jsonRaw[key] = value;
    });
    if (jsonRaw.avatar && jsonRaw.avatar instanceof File) {
      const avatar = (await fileToDataURL(jsonRaw.avatar)) || '';
      jsonRaw.avatar = avatar && avatar !== 'data:' ? avatar : '';
    }
    const json = jsonRaw as Record<string, string>;
    this.userInfoFetching = true;

    // If there is no auth token on submit, it means user entered password to decrypt wallet
    if (!this.authToken) {
      this.walletPluginService
        .decrypt(json.password)
        .then(() => this.fetchUserInfo(this.address))
        .catch(err => {
          return this.snackBarService.show('Wrong password');
        })
        .then(() => {
          this.userInfoFetching = false;
        });
      return;
    }

    this.apiService
      .postUserInfo(
        {
          name: json.name,
          surname: json.surname,
          email: json.email,
          avatar: json.avatar || (this.userInfo?.avatar ?? ''),
          dvitaId: json.dvitaId || (this.userInfo?.dvitaId ?? ''),
          twitter: json.twitter || (this.userInfo?.twitter ?? ''),
        },
        this.authToken
      )
      .then(() => this.snackBarService.show('Info updated'))
      .catch(err => this.snackBarService.show(err.message))
      .then(() => {
        this.userInfoFetching = false;
      });
  }

  async onAvatarChange(event: { target: EventTarget | null }): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    fileToDataURL(file)
      .then(dataURL => {
        if (!this.userInfo) {
          throw new Error('User info must be fetched before saving');
        }
        this.userInfo.avatar = dataURL ?? '';
      })
      .catch(err => {
        if (!this.userInfo) {
          throw new Error('User info must be fetched before saving');
        }
        this.userInfo.avatar = '';
        console.error(err);
      });
  }

  onAvatarRemove(): void {
    if (this.userInfo) {
      this.userInfo.avatar = '';
    }
  }

  onTwitterInputClick(): void {
    this.apiService.getTwitterAuthUrl(this.address, this.authToken).subscribe(
      (authUrl: string) => {
        this.twitterAuthWindow = window.open(authUrl, '_blank', 'width=500,height=800');
      },
      err => {
        console.error(err);
      }
    );
  }

  onTwitterCopyClick(): void {
    if (this.userInfo?.twitter) {
      const twitterNormalized = `@${this.userInfo?.twitter}`;
      this.copy(twitterNormalized);
    }
  }

  onTwitterRemoveClick(): void {
    if (this.userInfo) {
      this.userInfo.twitter = undefined;
    }
  }

  onIdCopyClick(): void {
    if (this.userInfo?.dvitaId) {
      const idNormalized = `${this.userInfo?.dvitaId}.id.dvita.com`;
      this.copy(idNormalized);
    }
  }

  setTwitterUsername(): void {
    this.apiService.getTwitterUsername(this.address, this.authToken).subscribe(
      (authName: string) => {
        if (this.userInfo) {
          this.userInfo.twitter = authName;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  private fetchAndUpdate(): void {
    this.loading = true;
    Promise.all([
      this.fetchAndUpdateBalances(this.address),
      this.fetchAndUpdateTransactions(this.address),
      this.fetchUserInfo(this.address),
    ]).then(() => (this.loading = false));
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  private fetchAndUpdateBalances(address: string): Promise<void> {
    return this.apiService
      .balance(address)
      .catch(err => {
        this.snackBarService.show('Could not fetch wallet balance');
        throw err;
      })
      .then((balances): AssetData[] => {
        if (!balances.length) {
          throw new Error('Server returned empty balance list, probably this is a new wallet');
        }
        return balances
          .map(balance => {
            const code = balance.asset.code || balance.asset.hash;
            return {
              name: balance.asset.name || balance.asset.code || balance.asset.hash,
              hash: balance.asset.hash,
              icon:
                balance.asset.metadata && balance.asset.metadata.icon
                  ? balance.asset.metadata.icon
                  : generateImage(balance.asset.code || balance.asset.hash),
              type: this.tokenType(code),
              amount: balance.formatted,
              decimals: balance.asset.decimals || '0',
            };
          })
          .sort((a, b) => {
            // put DVITA and DVG at the beginning
            const orderA = a.name === 'DVITA' ? 2 : a.name === 'DVG' ? 1 : 0;
            const orderB = b.name === 'DVITA' ? 2 : b.name === 'DVG' ? 1 : 0;
            return orderB - orderA;
          });
      })
      .catch((err): AssetData[] => {
        console.warn(`Falling back to default balances: ${'message' in err ? err.message : err}`);
        // probably address doesn't exist, show zeros for DVITA and DVG
        return [
          {
            name: 'DVITA',
            icon: 'assets/icons/token_dvita.png',
            type: this.tokenType('DVITA'),
            amount: String(0),
            decimals: '0',
          },
          {
            name: 'DVG',
            icon: 'assets/icons/token_dvg.png',
            type: this.tokenType('DVG'),
            amount: String(0),
            decimals: '18',
          },
        ];
      })
      .then(assetsList => {
        this.assetsList = assetsList;
        this.amountDVITA = this.assetsList.find(asset => asset.name === 'DVITA')?.amount ?? String(0);
        this.amountDVG = this.assetsList.find(asset => asset.name === 'DVG')?.amount ?? String(0);
        this.assetsDataSource = new MatTableDataSource(this.assetsList);
        this.assetsDataSource.sort = this.assetsSort;
        this.assetNames = this.assetsList.map(asset => ({ name: asset.name }));
        this.transferModel.asset = this.assetsList[0]?.name ?? '';
        this.transferAssetMaximum = this.assetsList[0]?.amount ?? '';
      });
  }

  private fetchAndUpdateTransactions(address: string): Promise<void> {
    return this.apiService
      .transfers(address)
      .then((transfers): TransactionData[] => {
        return transfers
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(transfer => {
            const amount = new Decimal(transfer.amount)
              .div(new Decimal(10).pow(Number(transfer.asset.decimals)))
              .toString();
            return {
              icon: 'send',
              type: transfer.type === 'SENT' ? 'Transfer out' : 'Transfer in',
              transactionId: transfer.txHash,
              amount: `${amount} ${transfer.asset.code}`,
              completedOn: new Date(transfer.timestamp).toISOString(),
            };
          });
      })
      .catch((err): TransactionData[] => {
        this.snackBarService.show('Could not fetch transaction list');
        // probably address doesn't exist, show empty list
        return [];
      })
      .then(transactions => {
        this.allTransactions = transactions;
        this.paginator.dataLength = this.allTransactions.length;
        this.transactions = this.allTransactions.slice(0, this.paginator.pageSize);
        this.transactionsDataSource = new MatTableDataSource(this.transactions);
        this.transactionsDataSource.sort = this.transactionsSort;
      });
  }

  private async fetchUserInfo(address: string): Promise<void> {
    this.userInfoFetching = true;
    Promise.resolve(this.user ? this.authService.createAuthToken(this.user.wallet.providerName) : undefined)
      .then(authToken => (this.authToken = authToken))
      .catch(err => {
        // if there is an error while signing the token (for example wallet is encrypted), just fetch public data
        console.warn(`Could not fetch user info: `, err);
        return;
      })
      .then(() => this.apiService.getUserInfo(this.address, this.authToken))
      .then(userInfo => {
        this.userInfo = userInfo;
      })
      .catch(err => {
        this.snackBarService.show(err.message);
        this.authService.removeAuthToken(); // token might be expired, remove it from storage
      })
      .then(() => {
        this.userInfoFetching = false;
      });
  }

  private tokenType(code: string): string {
    return code === 'DVITA' ? 'Governance Token' : code === 'DVG' ? 'Utility Token' : 'Token';
  }
}

function fileToDataURL(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string | null);
    };
    reader.onerror = err => {
      reject(err);
    };
  });
}
