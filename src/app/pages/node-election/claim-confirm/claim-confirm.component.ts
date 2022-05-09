import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@app/../environments/environment';
import { TransactionService } from '@app/shared/services/transaction.service';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-claim-confirm',
  templateUrl: './claim-confirm.component.html',
  styleUrls: ['./claim-confirm.component.scss'],
})
export class ClaimConfirmComponent {
  fee = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { address: string },
    public dialogRef: MatDialogRef<ClaimConfirmComponent>,
    private readonly transactionService: TransactionService
  ) {
    transactionService
      .createTransfer(data.address, data.address, environment.tokenHashDVITA, 1)
      .then(({ txInstance }) => {
        const amountWithoutDecimals = txInstance.networkFee.add(txInstance.systemFee).toString();
        this.fee = new Decimal(amountWithoutDecimals).div(new Decimal(10).pow(environment.dvgDecimals)).toString();
      });
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
