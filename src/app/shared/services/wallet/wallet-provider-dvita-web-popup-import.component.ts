import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { wallet } from '@cityofzion/neon-core';

@Component({
  templateUrl: './wallet-provider-dvita-web-popup-import.component.html',
  styleUrls: ['./wallet-provider-dvita-web-popup-import.component.scss'],
})
export class WalletProviderDvitaWebPopupImportComponent {
  crypting = false;
  type: undefined | 'encrypted' | 'unencrypted' = undefined;

  constructor(
    private readonly snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<WalletProviderDvitaWebPopupImportComponent>
  ) {}

  onKeyInput(event: { target: EventTarget | null }): void {
    const input = event.target as HTMLInputElement;
    this.type = wallet.isNEP2(input.value)
      ? 'encrypted'
      : wallet.isWIF(input.value) || wallet.isPrivateKey(input.value)
      ? 'unencrypted'
      : undefined;
  }

  onConfirm(event: { currentTarget: EventTarget | null }): void | Promise<void> {
    const form = (event.currentTarget as HTMLDivElement).closest('form') as HTMLFormElement;
    const formData = new FormData(form);
    const privateKey = formData.get('privateKey') as string;
    const passphrase = formData.get('passphrase') as string;

    if (wallet.isNEP2(privateKey)) {
      this.crypting = true;
      return wallet
        .decryptNeo2(privateKey, passphrase)
        .then(wif => {
          const account = new wallet.Account(wif);
          return account.encrypt(passphrase); // encrypt so that it's exportable
        })
        .then(account => {
          this.dialogRef.close(account);
        })
        .catch(err => {
          this.snackBarService.show('message' in err ? err.message : err);
        })
        .then(() => {
          this.crypting = false;
        });
    }

    if (wallet.isWIF(privateKey) || wallet.isPrivateKey(privateKey)) {
      if (!passphrase) {
        return this.snackBarService.show('Please create a passphrase');
      }
      if (passphrase.length < 8) {
        return this.snackBarService.show('Passphrase is too short');
      }
      const account = new wallet.Account(privateKey);
      this.crypting = true;
      return account
        .encrypt(passphrase) // encrypt so that it's exportable
        .then(() => {
          this.dialogRef.close(account);
        })
        .catch(err => {
          this.snackBarService.show('message' in err ? err.message : err);
        })
        .then(() => {
          this.crypting = false;
        });
    }

    return this.snackBarService.show('Invalid private key');
  }
}
