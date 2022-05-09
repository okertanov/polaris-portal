export interface TableParams {
  from: number;
  limit: number;
  order: 'ascending' | 'descending';
}

export interface BlockInfo {
  confirmations: number;
  hash: string;
  index: string | number;
  size: number;
  timestamp: number;
  transactions: any[];
  version: string | number;
  witnesses?: any[];
  time?: string;
  createdOn?: string;
}

export interface Transaction {
  blockHash: string;
  blockIndex: string;
  index: string;
  hash: string;
  size: string;
  version: string;
  nonce: string;
  sender: string;
  sysfee: string;
  netfee: string;
  script: string;
  timestamp: number;
}

export interface BlockForTable {
  height: string;
  hash: string;
  time: string;
  size: string;
  createdOn: string;
  transactions: string;
}

export enum AreaTypes {
  CONTRACT = 'contract',
  TRANSACTION = 'tx',
  BLOCK = 'block',
}

export interface SearchParams {
  area: SearchArea;
  context: string;
  entity: string;
  term: string;
}

export type SearchArea = AreaTypes.CONTRACT | AreaTypes.TRANSACTION | AreaTypes.BLOCK;
