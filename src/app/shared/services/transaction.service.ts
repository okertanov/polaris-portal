import { Injectable } from '@angular/core';
import { environment } from '@app/../environments/environment';
import { APIService } from '@app/shared/services/api.service';
import { AnnounceTXParams } from '@app/shared/services/wallet/types';
import { sc, tx, wallet } from '@cityofzion/neon-core';
import Decimal from 'decimal.js';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  constructor(private readonly apiService: APIService) {}

  public async createTransfer(
    fromAddress: string,
    toAddress: string,
    assetHash: string,
    amount: number | string,
    isFromMultiSig = false
  ): Promise<AnnounceTXParams> {
    const script = sc.createScript({
      scriptHash: assetHash,
      operation: 'transfer',
      args: [
        sc.ContractParam.hash160(fromAddress),
        sc.ContractParam.hash160(toAddress),
        sc.ContractParam.integer(amount),
        sc.ContractParam.any(),
      ],
    });

    const validUntilBlock = (await this.apiService.blockCount()) + 1000;
    const signers = [
      {
        account: wallet.getScriptHashFromAddress(fromAddress),
        scopes: tx.WitnessScope.CalledByEntry,
      },
    ];
    const serializedTransactionLength = new tx.Transaction({
      signers,
      validUntilBlock,
      script,
    }).serialize().length;

    const fees = await this.apiService.fees(script, serializedTransactionLength);

    // Sending from multi-signature address requires larger network fee
    if (isFromMultiSig) {
      fees.networkFee = new Decimal(fees.networkFee).mul(3).toString();
    }

    return {
      fromAddress,
      toAddress,
      asset: assetHash,
      amount: String(amount),
      fee: new Decimal(fees.systemFee)
        .plus(fees.networkFee)
        .div(new Decimal(10).pow(environment.dvgDecimals))
        .toString(),
      txInstance: new tx.Transaction({
        signers,
        script,
        validUntilBlock,
        networkFee: fees.networkFee,
        systemFee: fees.systemFee,
      }),
    };
  }
}
