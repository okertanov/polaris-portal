import type { tx } from '@cityofzion/neon-core';
export type WalletProviderName = 'dvita' | 'dvita-web';

export interface AccountInfo {
  address: string;
  label?: string;
}

export interface BalanceInfo {
  icon: string;
  symbol: string;
  amount: string;
}

export interface WalletBalance {
  [address: string]: BalanceInfo;
}

export interface WalletInfo {
  providerName: WalletProviderName;
  account: AccountInfo;
}

export interface WalletProvider {
  ready(): Promise<WalletProvider>;
  connectWallet(): Promise<WalletInfo>;
  signMessage(message: string): Promise<any>;
  signTx(txInstance: tx.Transaction): Promise<string>;
  signAndAnnounceTx(params: AnnounceTXParams): Promise<{ txid: string }>;
  invoke(params: object): Promise<{ txid: string }>;
  getPublicKey(): Promise<string>;
}

export interface AnnounceTXParams {
  fromAddress: string;
  toAddress: string;
  asset: string;
  amount: string;
  fee?: string;
  broadcastOverride?: boolean;
  txInstance: tx.Transaction;
}
