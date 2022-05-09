import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '@app/shared/services/api.service';
import { AuthService } from '@app/shared/services/auth.service';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { WalletPluginService } from '@app/shared/services/wallet/wallet.plugin.service';
import { WebWalletStorageService } from '@app/shared/services/web-wallet-storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  passwordType = 'password';
  keyType = 'password';
  status = 'login';
  hasExtension = !!window.dVITAWallet;
  savedWallets = this.webWalletStorageService.getWallets();
  loginForm: 'new' | 'existing' = this.savedWallets.length ? 'existing' : 'new';
  creatingWallet = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly snackBarService: SnackBarService,
    private readonly apiService: APIService,
    private readonly webWalletStorageService: WebWalletStorageService,
    private readonly walletPluginService: WalletPluginService
  ) {}

  ngOnInit(): void {
    this.walletPluginService.ready('dvita').then(() => {
      this.hasExtension = true;
    });
  }

  toggleType(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else if (this.passwordType === 'text') {
      this.passwordType = 'password';
    }
  }

  toggleKeyType(): void {
    if (this.keyType === 'password') {
      this.keyType = 'text';
    } else if (this.keyType === 'text') {
      this.keyType = 'password';
    }
  }

  toggleStatus(): void {
    if (this.status === 'login') {
      this.status = 'connect';
    } else if (this.status === 'connect') {
      this.status = 'login';
    }
  }

  connect(): void {
    this.auth.logIn('dvita').then(user => {
      this.onLoggedIn(user.wallet.account.address);
    });
  }

  onImportPrivateKey(): void {
    this.walletPluginService
      .importPrivateKey()
      .then(() => this.auth.logIn('dvita-web'))
      .then(user => {
        this.onLoggedIn(user.wallet.account.address);
      })
      .catch(err => {
        this.snackBarService.show('message' in err ? err.message : err);
        console.warn(err);
      });
  }

  async onImportJSON(event: { target: EventTarget | null }): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = err => {
        reject(err);
      };
      reader.readAsText(file);
    })
      .then(json => this.walletPluginService.importWalletJSON(json))
      .then(() => this.auth.logIn('dvita-web'))
      .then(user => {
        this.onLoggedIn(user.wallet.account.address);
      })
      .catch(err => {
        this.snackBarService.show('message' in err ? err.message : err);
      });
  }

  onUseExistingWalletSubmit(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const address = new FormData(form).get('address') as string;
    this.webWalletStorageService.selectWallet(address);
    this.auth
      .logIn('dvita-web')
      .then(user => {
        this.onLoggedIn(user.wallet.account.address);
      })
      .catch(err => {
        this.snackBarService.show('message' in err ? err.message : err);
      });
  }

  async onLoginSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    this.creatingWallet = true;

    let address = '';
    this.walletPluginService
      .createWallet('dvita-web', { email, password })
      .then(() => this.auth.logIn('dvita-web'))
      .then(user => {
        address = user.wallet.account.address;
      })
      // save e-mail in server
      .then(() => this.walletPluginService.decrypt(password))
      .then(() => this.auth.createAuthToken('dvita-web'))
      .then(authToken =>
        this.apiService.postUserInfo({ name: '', surname: '', email, avatar: '', dvitaId: '', twitter: '' }, authToken)
      )
      .then(() => this.onLoggedIn(address))
      .catch(err => {
        this.snackBarService.show('message' in err ? err.message : err);
      })
      .then(() => {
        this.creatingWallet = false;
      });
  }

  install(): void {
    window.location.href = `${environment.extensionDownloadURL}`;
  }

  private onLoggedIn(address: string): void {
    const navState = this.location.getState();
    const prevURL =
      navState && typeof navState === 'object' && 'from' in navState
        ? String((navState as { from: unknown }).from)
        : null;
    this.router.navigateByUrl(prevURL || `/wallet/${address}`);
  }
}
