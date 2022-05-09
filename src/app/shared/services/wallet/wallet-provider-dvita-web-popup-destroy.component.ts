import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './wallet-provider-dvita-web-popup-destroy.component.html',
})
export class WalletProviderDvitaWebPopupDestroyComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { export: () => void },
    public dialogRef: MatDialogRef<WalletProviderDvitaWebPopupDestroyComponent>
  ) {}

  onExport(): void {
    this.data.export();
  }

  onConfirm(): void {
    this.dialogRef.close(
      confirm(
        [
          'Are you sure you want to destory this wallet?',
          'Funds will be lost forever unless you have the wallet file',
        ].join('\n')
      )
    );
  }
}
