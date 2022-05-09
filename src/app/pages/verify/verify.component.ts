import { Component, ElementRef, ViewChild } from '@angular/core';
import { APIService } from '@app/shared/services/api.service';
import { AuthService } from '@app/shared/services/auth.service';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { WalletPluginService } from '@app/shared/services/wallet/wallet.plugin.service';
import { tx, u, wallet } from '@cityofzion/neon-core';
import Decimal from 'decimal.js';
import { disassemble } from './disassemble';

const knownNetworks: [label: string, networkMagic: number][] = [
  ['dVITA TestNet', 199],
  ['NEO3 MainNet', 860833102],
  ['NEO3 TestNet', 877933390],
];

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent {
  transaction: tx.Transaction | null = null;
  transactionJSON: tx.TransactionJson | null = null;
  transfer: { from: string; to: string; amountFormatted: string; assetHash: string } | null = null;
  signatureData: { pubKey: string; signature: string; valid: false | [string, number] }[][] | null = null;
  multiFormVisible = false;
  wallet = wallet;
  disassemble = disassemble;
  loading = false;

  @ViewChild('form') form!: ElementRef<HTMLFormElement>;

  constructor(
    private readonly snackBarService: SnackBarService,
    private readonly walletPluginService: WalletPluginService,
    private readonly apiService: APIService,
    private readonly authService: AuthService
  ) {}

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    const raw = new FormData(event.target as HTMLFormElement).get('raw') as string;
    const transaction = tx.Transaction.deserialize(raw);
    this.loading = true;
    this.transfer = await this.getTransferInfo(transaction);
    this.loading = false;
    this.setTx(transaction);
    this.multiFormVisible = false;
  }

  convertToMultiWitness(event: Event): void {
    event.preventDefault();
    const verificationScript = new FormData(event.target as HTMLFormElement).get('multiVerificationScript') as string;
    if (!this.transaction) {
      throw new Error('Transaction not defined'); // this point is unreachable
    }

    const transaction = this.transaction;
    const multiSigWitness = tx.Witness.buildMultiSig(
      transaction.serialize(false),
      transaction.witnesses,
      verificationScript
    );
    const newTx = tx.Transaction.deserialize(transaction.serialize(true));
    newTx.witnesses = [multiSigWitness];
    this.setTx(newTx);
    this.snackBarService.show('Signatures converted, transaction updated');
  }

  sign(transaction: tx.Transaction): void {
    if (!this.authService.user) {
      this.snackBarService.show('Please connect wallet first');
      return;
    }
    this.walletPluginService
      .signTx(this.authService.user.wallet.providerName, transaction)
      .then(serializedSignedTx => {
        this.setTx(tx.Transaction.deserialize(serializedSignedTx));
        this.snackBarService.show('Signature added, transaction updated');
      })
      .catch(err => {
        console.error(err);
        this.snackBarService.show('message' in err ? err.message : String(err));
      });
  }

  private setTx(transaction: tx.Transaction): void {
    try {
      const els = this.form.nativeElement.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement>;
      els.raw.value = transaction.serialize(true);
      this.form.nativeElement.scrollIntoView();

      this.transaction = transaction;
      this.transactionJSON = this.transaction.toJson();

      const hash = this.transaction.hash();
      const signedMessages = knownNetworks.map(
        ([, networkMagic]) => u.num2hexstring(networkMagic, 4, true) + u.reverseHex(hash)
      );

      this.signatureData = this.transaction.witnesses.map(witness => {
        const pubKeys = wallet.getPublicKeysFromVerificationScript(witness.verificationScript.toString());
        const signatures = wallet.getSignaturesFromInvocationScript(witness.invocationScript.toString());
        return signatures.map((signature, index) => {
          // loop and check all public keys against all known networks
          let validIndex = -1;
          let pubKey: string = pubKeys[index];
          for (let i = 0; i < signedMessages.length; i++) {
            for (const key of pubKeys) {
              if (wallet.verify(signedMessages[i], signature, key)) {
                pubKey = key;
                validIndex = i;
                i = signedMessages.length; // breaks outer loop
                break;
              }
            }
          }

          return { signature, pubKey, valid: validIndex === -1 ? false : knownNetworks[validIndex] };
        });
      });
    } catch (err: any) {
      console.error(err);
      this.snackBarService.show(`Error: ${'message' in err ? err.message : err}`);
      this.transaction = null;
      this.transactionJSON = null;
    }
  }

  private async getTransferInfo(transaction: tx.Transaction): Promise<{
    from: string;
    to: string;
    amountFormatted: string;
    assetHash: string;
  } | null> {
    try {
      const disassembledScript = disassemble(transaction.script.toBase64());
      const commands = disassembledScript.trim().split('\n');
      if (commands[commands.length - 1] === 'ASSERT') {
        // ignore optional assert instruction at the end
        commands.pop();
      }
      if (commands[commands.length - 1] !== 'SYSCALL System.Contract.Call') {
        throw new Error('This is not a contract call');
      }
      const assetHashUnprefixed = u.HexString.fromHex(commands[commands.length - 2].split(' ')[1]).toLittleEndian();
      if (!wallet.isAddress(wallet.getAddressFromScriptHash(assetHashUnprefixed))) {
        throw new Error('Contract is not a valid address');
      }
      const method = u.HexString.fromHex(commands[commands.length - 3].split(' ')[1]).toAscii();
      if (method !== 'transfer') {
        throw new Error(`Expected method name to be 'transfer' but got '${method}'`);
      }
      const receiver = wallet.getAddressFromScriptHash(u.HexString.fromHex(commands[2].split(' ')[1]).toLittleEndian());
      if (!wallet.isAddress(receiver)) {
        throw new Error('Sender is not a valid address');
      }
      const sender = wallet.getAddressFromScriptHash(u.HexString.fromHex(commands[3].split(' ')[1]).toLittleEndian());
      if (!wallet.isAddress(receiver)) {
        throw new Error('Receiver is not a valid address');
      }
      const amountRaw = this.getAmount(commands[1]);
      const assetHash = `0x${assetHashUnprefixed}`;
      const contract = await this.apiService.contract(assetHash);
      const name =
        contract.token.name === contract.token.symbol
          ? contract.token.symbol
          : `${contract.token.name} (${contract.token.symbol})`;
      const amount = new Decimal(amountRaw).div(new Decimal(10).pow(Number(contract.token.decimals))).toString();
      return {
        from: sender,
        to: receiver,
        amountFormatted: `${amount} ${name}`,
        assetHash,
      };
    } catch (err) {
      console.warn(`Could not extract transfer info, this tx might not be a transfer: ${err}`);
    }
    return null;
  }

  private getAmount(amountCommand: string): string {
    const parts = amountCommand.split(' ');
    switch (parts[0]) {
      case 'PUSH0':
        return '0';
      case 'PUSH1':
        return '1';
      case 'PUSH2':
        return '2';
      case 'PUSH3':
        return '3';
      case 'PUSH4':
        return '4';
      case 'PUSH5':
        return '5';
      case 'PUSH6':
        return '6';
      case 'PUSH7':
        return '7';
      case 'PUSH8':
        return '8';
      case 'PUSH9':
        return '9';
      case 'PUSH10':
        return '10';
      case 'PUSH11':
        return '11';
      case 'PUSH12':
        return '12';
      case 'PUSH13':
        return '13';
      case 'PUSH14':
        return '14';
      case 'PUSH15':
        return '15';
      case 'PUSH16':
        return '16';
      case 'PUSHINT8':
      case 'PUSHINT16':
      case 'PUSHINT32':
      case 'PUSHINT64':
      case 'PUSHINT128':
      case 'PUSHINT256':
        return u.BigInteger.fromTwos(parts[1], true).toString();
      default:
        throw new Error(`Could not parse transfer amount: ${amountCommand}`);
    }
  }
}
