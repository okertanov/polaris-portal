import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { wallet } from '@cityofzion/neon-core';

@Component({
  templateUrl: './wallet-provider-dvita-web-popup-unlock.component.html',
  styleUrls: ['./wallet-provider-dvita-web-popup-unlock.component.scss'],
})
export class WalletProviderDvitaWebPopupUnlockComponent {
  decrypting = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      message?: string;
      wallet: wallet.Account;
    },
    private readonly snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<WalletProviderDvitaWebPopupUnlockComponent>
  ) {}

  onConfirm(event: { currentTarget: EventTarget | null }): void {
    const form = (event.currentTarget as HTMLDivElement).closest('form') as HTMLFormElement;
    const pwdRaw = new FormData(form).get('password');
    const pwd = typeof pwdRaw === 'string' ? pwdRaw : '';
    this.decrypting = true;
    this.data.wallet
      .decrypt(pwd)
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.snackBarService.show('Incorrect password');
      })
      .then(() => {
        this.decrypting = false;
      });
  }
}
