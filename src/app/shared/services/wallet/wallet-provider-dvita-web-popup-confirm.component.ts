import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@app/../environments/environment';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import Decimal from 'decimal.js';

@Component({
  templateUrl: './wallet-provider-dvita-web-popup-confirm.component.html',
  styleUrls: ['./wallet-provider-dvita-web-popup-confirm.component.scss'],
})
export class WalletProviderDvitaWebPopupConfirmComponent {
  fee: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      readableTransactionJSON: Record<string, any>;
      signerAddress: string;
    },
    private readonly snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<WalletProviderDvitaWebPopupConfirmComponent>
  ) {
    this.fee =
      data.readableTransactionJSON.fee ||
      new Decimal(data.readableTransactionJSON.netfee || 0)
        .plus(data.readableTransactionJSON.sysfee || 0)
        .div(new Decimal(10).pow(environment.dvgDecimals))
        .toString();
  }

  onConfirm(event: { currentTarget: EventTarget | null }): void {
    this.dialogRef.close(true);
  }

  stringify(obj: object): string {
    return JSON.stringify(obj, null, 2);
  }
}
