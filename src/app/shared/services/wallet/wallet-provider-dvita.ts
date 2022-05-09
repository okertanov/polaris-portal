import { tx } from '@cityofzion/neon-core';
import { AccountInfo, AnnounceTXParams, WalletBalance, WalletInfo, WalletProvider } from './types';

export class WalletProviderDvita implements WalletProvider {
  private dVITAWalletPromise: Promise<DVITAWallet>;

  constructor() {
    this.dVITAWalletPromise = new Promise(resolve => {
      window.addEventListener('dVITAWallet.EVENT.READY', () => {
        resolve(new window.dVITAWallet.Init());
      });
    });
  }

  async connectWallet(): Promise<WalletInfo> {
    const wallet = await this.dVITAWalletPromise;
    const account = await wallet.getAccount();
    const balance = await wallet.getBalance().catch(err => {
      console.error(err);
      return { [account.address]: [{ symbol: 'DVG', amount: '0', contract: '' }] };
    });
    return {
      account,
      providerName: 'dvita',
    };
  }

  async getPublicKey(): Promise<string> {
    const wallet = await this.dVITAWalletPromise;
    return (await wallet.getPublicKey()).publicKey;
  }

  async signMessage(messageToSign: string): Promise<{ publicKey: string; salt: string; data: string }> {
    const wallet = await this.dVITAWalletPromise;
    const { message, ...result } = await wallet.signMessage({ message: messageToSign });
    return result;
  }

  async signTx(transaction: tx.Transaction): Promise<string> {
    const wallet = await this.dVITAWalletPromise;
    return wallet
      .send({ rawTx: transaction.serialize(true), broadcastOverride: true })
      .then(({ signedTx }) => signedTx)
      .catch(err => {
        throw new Error(err.type);
      });
  }

  async signAndAnnounceTx(params: AnnounceTXParams): Promise<{ txid: string }> {
    const wallet = await this.dVITAWalletPromise;
    const { txInstance, ...rest } = params;
    return wallet.send(rest).catch(err => {
      throw new Error(err.type);
    });
  }

  async ready(): Promise<WalletProvider> {
    return this.dVITAWalletPromise.then(() => this);
  }

  async invoke(transaction: object): Promise<{ txid: string }> {
    const wallet = await this.dVITAWalletPromise;
    return wallet.invoke({ ...transaction, network: 'TestNet' });
  }
}

interface Balance {
  amount: string;
  symbol: string;
  contract: string;
}

interface DVITAWallet {
  getProvider: () => Promise<any>;
  getNetworks: () => Promise<any>;
  getAccount: () => Promise<AccountInfo>;
  getPublicKey: () => Promise<{ publicKey: string; address: string }>;
  getBalance: () => Promise<Record<string, Balance[]>>;
  getStorage: () => Promise<any>;
  invokeRead: () => Promise<any>;
  invokeReadMulti: () => Promise<any>;
  verifyMessage: () => Promise<any>;
  getTransaction: () => Promise<any>;
  invoke: (tx: object) => Promise<{ txid: string }>;
  invokeMulti: () => Promise<any>;
  signMessage: (props: {
    message: string;
  }) => Promise<{ message: string; publicKey: string; salt: string; data: string }>;
  deploy: () => Promise<any>;
  getBlock: () => Promise<any>;
  send(params: { rawTx: string; broadcastOverride: true }): Promise<{ signedTx: string }>;
  send(params: Omit<AnnounceTXParams, 'txInstance'>): Promise<{ txid: string }>;
}

function dvgBalance(balances: Record<string, Balance[]>): WalletBalance {
  const out: WalletBalance = {};
  for (const address in balances) {
    if (balances.hasOwnProperty(address)) {
      const gasBalance = balances[address].find(acc => acc.symbol === 'DVG');
      out[address] = {
        ...(gasBalance ? gasBalance : { symbol: 'DVG', amount: '0' }),
        icon: 'assets/icons/token_dvita.png',
      };
    }
  }
  return out;
}
