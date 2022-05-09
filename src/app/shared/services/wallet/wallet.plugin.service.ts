import { Injectable } from '@angular/core';
import { WalletProvider, WalletProviderName } from './types';
import { WalletProviderDvita } from './wallet-provider-dvita';
import { WalletProviderDvitaWeb } from './wallet-provider-dvita-web';

@Injectable({ providedIn: 'root' })
export class WalletPluginService {
  private providers: {
    dvita: WalletProviderDvita;
    'dvita-web': WalletProviderDvitaWeb;
  };

  constructor(walletProviderDvitaWeb: WalletProviderDvitaWeb) {
    this.providers = {
      dvita: new WalletProviderDvita(),
      'dvita-web': walletProviderDvitaWeb,
    };
  }

  async connectWallet(providerName: WalletProviderName): ReturnType<WalletProvider['connectWallet']> {
    return this.providers[providerName].connectWallet();
  }

  signMessage(providerName: WalletProviderName, message: string): ReturnType<WalletProvider['signMessage']> {
    return this.providers[providerName].signMessage(message);
  }

  signTx(
    providerName: WalletProviderName,
    ...params: Parameters<WalletProviderDvitaWeb['signTx']>
  ): ReturnType<WalletProvider['signTx']> {
    return this.providers[providerName].signTx(...params);
  }

  signAndAnnounceTx(
    providerName: WalletProviderName,
    ...params: Parameters<WalletProvider['signAndAnnounceTx']>
  ): ReturnType<WalletProvider['signAndAnnounceTx']> {
    return this.providers[providerName].signAndAnnounceTx(...params);
  }

  ready(providerName: WalletProviderName): ReturnType<WalletProvider['ready']> {
    return this.providers[providerName].ready();
  }

  invoke(providerName: WalletProviderName, tx: any): ReturnType<WalletProvider['invoke']> {
    return this.providers[providerName].invoke(tx);
  }

  getPublicKey(providerName: WalletProviderName): ReturnType<WalletProvider['getPublicKey']> {
    return this.providers[providerName].getPublicKey();
  }

  // web wallet only
  createWallet(
    providerName: 'dvita-web',
    params: { email: string; password: string }
  ): ReturnType<WalletProviderDvitaWeb['createWallet']> {
    return this.providers['dvita-web'].createWallet(params);
  }

  // web wallet only
  decrypt(password: string): ReturnType<WalletProviderDvitaWeb['decrypt']> {
    return this.providers['dvita-web'].decrypt(password);
  }

  // web wallet only
  export(): ReturnType<WalletProviderDvitaWeb['export']> {
    return this.providers['dvita-web'].export();
  }

  // web wallet only
  importWalletJSON(json: string): ReturnType<WalletProviderDvitaWeb['importWalletJSON']> {
    return this.providers['dvita-web'].importWalletJSON(json);
  }

  // web wallet only
  destroy(): ReturnType<WalletProviderDvitaWeb['destroy']> {
    return this.providers['dvita-web'].destroy();
  }

  // web wallet only
  importPrivateKey(): ReturnType<WalletProviderDvitaWeb['importPrivateKey']> {
    return this.providers['dvita-web'].importPrivateKey();
  }
}
