import { Injectable, OnDestroy } from '@angular/core';
import { APIService } from '@app/shared/services/api.service';
import { WalletInfo, WalletProviderName } from '@app/shared/services/wallet/types';
import { WalletPluginService } from '@app/shared/services/wallet/wallet.plugin.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SessionStorageService } from './session-storage.service';

const authTokenStorageKey = 'authToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private userSubject = new BehaviorSubject<User | null>(this.getUserInStorage());
  private userSubjectSubscription: Subscription;

  constructor(
    private readonly walletPluginService: WalletPluginService,
    private readonly apiService: APIService,
    private readonly sessionStorageService: SessionStorageService
  ) {
    this.userSubjectSubscription = this.userSubject.subscribe(user => this.setUserInStorage(user));
  }

  ngOnDestroy(): void {
    this.userSubjectSubscription.unsubscribe();
  }

  public get userObservable(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  public get user(): User | null {
    return this.userSubject.value;
  }

  async logIn(provider: WalletProviderName): Promise<User> {
    const wallet = await this.walletPluginService.connectWallet(provider);
    const user: User = {
      name: '',
      surname: '',
      email: '',
      wallet,
    };
    this.userSubject.next(user);
    return user;
  }

  logOut(): void {
    this.removeAuthToken();
    this.userSubject.next(null);
  }

  async createAuthToken(provider: WalletProviderName): Promise<string> {
    await this.walletPluginService.ready(provider);

    const tokenInStorage = this.sessionStorageService.getItem(authTokenStorageKey);
    if (tokenInStorage) {
      return tokenInStorage;
    }

    const { signable, prefix } = await this.apiService.getSignableToken();
    const messageToSign = prefix + JSON.parse(atob(signable.split('.')[1])).nonce;
    const signature = await this.walletPluginService.signMessage(provider, messageToSign);
    const header = base64WithoutPadding(JSON.stringify({ alg: 'none' }));
    const payload = base64WithoutPadding(JSON.stringify({ signable, signature: ['dvita', signature] }));
    const token = `${header}.${payload}.`;
    this.sessionStorageService.setItem(authTokenStorageKey, token);
    return token;
  }

  removeAuthToken(): void {
    this.sessionStorageService.removeItem(authTokenStorageKey);
  }

  private getUserInStorage(): User | null {
    try {
      const raw = this.sessionStorageService.getItem('user');
      if (!raw) {
        return null;
      }

      const maybeUser = JSON.parse(raw);
      if (
        typeof maybeUser === 'object' &&
        typeof maybeUser.name === 'string' &&
        typeof maybeUser.surname === 'string' &&
        typeof maybeUser.email === 'string' &&
        typeof maybeUser.wallet === 'object' &&
        typeof maybeUser.wallet.account === 'object' &&
        typeof maybeUser.wallet.account.address === 'string' &&
        ['string', 'undefined'].includes(typeof maybeUser.wallet.account.label)
      ) {
        return maybeUser as User;
      } else {
        throw new Error(`Invalid user in storage: ${maybeUser}`);
      }
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  private setUserInStorage(user: User | null): void {
    if (!user) {
      this.sessionStorageService.removeItem('user');
    } else {
      this.sessionStorageService.setItem('user', JSON.stringify(user));
    }
  }
}

export interface User {
  name: string | null;
  surname: string | null;
  email: string | null;
  wallet: WalletInfo;
}

function base64WithoutPadding(str: string): string {
  return btoa(str).replace(/=/g, '');
}
