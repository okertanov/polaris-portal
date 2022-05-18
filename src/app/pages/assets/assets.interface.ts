import { AssetsFormType } from '@app/pages/assets/assets.service';

export interface FormTypesData {
  name: string;
  type: AssetsFormType;
}

export interface AssetData {
  address: string;
  code: string;
  createdDate: string;
  description: string;
  metadata: any;
  name: string;
  ownerAddress: string;
  script: string;
  scriptHash: string;
  token: {
    address: string;
    decimals: number;
    name: string;
    ownerAddress: null;
    scriptHash: string;
    symbol: string;
    type: string;
  };
  transaction: any;
}
