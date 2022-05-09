import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { wallet } from '@cityofzion/neon-core';

const storageKeyWallets = 'encryptedDVITAWallets';
const storageKeySelectedWallet = 'selectedEncryptedDVITAWalletAddress';

export interface SavableWallet {
  email: string;
  walletJSON: wallet.AccountJSON;
}

@Injectable({ providedIn: 'root' })
export class WebWalletStorageService {
  constructor(private localStorageService: LocalStorageService) {}

  getWallet(): wallet.Account | null {
    const wallets = this.getWallets();
    const selectedWalletAddress = this.localStorageService.getItem(storageKeySelectedWallet);
    if (selectedWalletAddress) {
      try {
        const walletObj =
          Array.isArray(wallets) && wallets.find(item => item.walletJSON.address === selectedWalletAddress);
        if (!walletObj) {
          throw new Error(`Could not get wallet from storage, invalid data`);
        }
        const account = new wallet.Account(walletObj.walletJSON);
        if (account.address !== selectedWalletAddress) {
          throw new Error(`Could not get wallet from storage, invalid data`);
        }
        return account;
      } catch (err) {
        console.warn(`Could not parse stored wallet: ${err}`);
      }
    }
    return null;
  }

  getWallets(): SavableWallet[] {
    try {
      const wallets = JSON.parse(this.localStorageService.getItem(storageKeyWallets) ?? '');
      return Array.isArray(wallets) ? wallets.filter(validateWallet) : [];
    } catch (err) {
      console.warn(`Could not parse wallets in local storage`, err);
      return [];
    }
  }

  saveWallet(walletToSave: SavableWallet): void {
    const wallets = this.getWallets();
    const walletAlreadySaved = wallets.find(item => item.walletJSON.address === walletToSave.walletJSON.address);
    if (!walletAlreadySaved) {
      wallets.push(walletToSave);
      this.localStorageService.setItem(storageKeyWallets, JSON.stringify(wallets));
    }
    this.localStorageService.setItem(storageKeySelectedWallet, walletToSave.walletJSON.address);
  }

  selectWallet(address: string): void {
    this.localStorageService.setItem(storageKeySelectedWallet, address);
  }

  deleteWallet(address: string): void {
    const wallets = this.getWallets();
    const selectedWalletAddress = this.localStorageService.getItem(storageKeySelectedWallet);
    const remainingWallets = wallets.filter(({ walletJSON }) => walletJSON.address !== address);
    this.localStorageService.setItem(storageKeyWallets, JSON.stringify(remainingWallets));
    if (selectedWalletAddress === address) {
      this.localStorageService.removeItem(storageKeySelectedWallet);
    }
  }
}

function validateWallet(maybeWallet: any): maybeWallet is SavableWallet {
  try {
    const walletObj = new wallet.Account(maybeWallet.walletJSON);
    return !!walletObj.address;
  } catch (err) {
    return false;
  }
}
