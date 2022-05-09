import { Component, ElementRef, ViewChild } from '@angular/core';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { wallet } from '@cityofzion/neon-core';

@Component({
  selector: 'app-multisig-wallet',
  templateUrl: './multisig-wallet.component.html',
  styleUrls: ['./multisig-wallet.component.scss'],
})
export class MultisigWalletComponent {
  publicKeys = ['', '', ''];
  verificationScript = '';

  @ViewChild('result') result!: ElementRef;

  constructor(private readonly snackBarService: SnackBarService) {}

  addKey(): void {
    this.publicKeys.push('');
  }

  removeKey(index: number): void {
    this.publicKeys.splice(index, 1);
  }

  resetValidity(event: Event): void {
    const el = event.target as HTMLInputElement;
    el.setCustomValidity('');
    this.verificationScript = '';
  }

  submit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const elements = form.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement>;

    // validate public keys
    const publicKeys: string[] = [];
    formData.forEach((rawValue, key) => {
      const value = (rawValue as string).trim();
      if (key.startsWith('publicKey') && value) {
        if (publicKeys.includes(value)) {
          elements[key].setCustomValidity(`No duplicates please`);
          elements[key].reportValidity();
        } else if (!wallet.isPublicKey(value)) {
          elements[key].setCustomValidity('This public key is invalid');
          elements[key].reportValidity();
        } else {
          publicKeys.push(value);
        }
      }
    });

    // validate threshold
    const threshold = Number(formData.get('threshold'));
    if (form.checkValidity()) {
      if (threshold < 1 || threshold > publicKeys.length) {
        elements.threshold.setCustomValidity('Number must be between 1 and the amount of public keys');
        elements.threshold.reportValidity();
      }
    }

    if (form.checkValidity()) {
      // Sort the keys in the same way as neo-cli is sorting them, so that the generated address matches neo-cli
      // https://github.com/neo-project/neo/blob/master/src/neo/SmartContract/Contract.cs#L108
      const sortedKeys = publicKeys
        .map(k => wallet.getPublicKeyUnencoded(k))
        .sort()
        .map(k => wallet.getPublicKeyEncoded(k));

      this.verificationScript = wallet.constructMultiSigVerificationScript(threshold, sortedKeys);
      this.result.nativeElement.scrollIntoView();
    }
  }

  getAddress(): string {
    return wallet.getAddressFromScriptHash(wallet.getScriptHashFromVerificationScript(this.verificationScript));
  }

  copy(text: string): void {
    navigator.clipboard
      .writeText(String(text))
      .then(() => this.snackBarService.show('Copied'))
      .catch(() => this.snackBarService.show('Could not copy, please do it manually'));
  }
}
