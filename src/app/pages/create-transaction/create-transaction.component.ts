import { Component, ElementRef, ViewChild } from '@angular/core';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { TransactionService } from '@app/shared/services/transaction.service';
import * as neon from '@cityofzion/neon-core';

const { tx, wallet } = neon;
(window as any).neon = neon;

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
})
export class CreateTransactionComponent {
  serializedTransaction = '';

  @ViewChild('result') result!: ElementRef;

  constructor(
    private readonly snackBarService: SnackBarService,
    private readonly transactionService: TransactionService
  ) {}

  resetValidity(event: Event): void {
    const el = event.target as HTMLInputElement;
    el.setCustomValidity('');
  }

  submit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const elements = form.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement>;

    const sender = formData.get('sender') as string;
    const recipient = formData.get('recipient') as string;
    const asset = formData.get('asset') as string;
    const amount = Number(formData.get('amount'));
    const isFromMultiSig = !!formData.get('isFromMultiSig');

    if (!wallet.isAddress(sender)) {
      elements.sender.setCustomValidity('Invalid address');
      elements.sender.reportValidity();
    }

    if (!wallet.isAddress(recipient)) {
      elements.recipient.setCustomValidity('Invalid address');
      elements.recipient.reportValidity();
    }

    if (isNaN(amount)) {
      elements.amount.setCustomValidity('Invalid amount');
      elements.amount.reportValidity();
    }

    if (form.checkValidity()) {
      this.transactionService.createTransfer(sender, recipient, asset, amount, isFromMultiSig).then(result => {
        this.serializedTransaction = result.txInstance.serialize(true);
        this.result.nativeElement.scrollIntoView();
      });
    }
  }

  copy(): void {
    navigator.clipboard
      .writeText(this.serializedTransaction)
      .then(() => this.snackBarService.show('Transaction copied'))
      .catch(() => this.snackBarService.show('Could not copy, please do it manually'));
  }
}
