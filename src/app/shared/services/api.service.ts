import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import Decimal from 'decimal.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessionStorageService } from './session-storage.service';

@Injectable({ providedIn: 'root' })
export class APIService implements OnDestroy {
  constructor(private readonly http: HttpClient, private readonly sessionStorageService: SessionStorageService) {
    const networkSubscription = this.network.subscribe(net => this.setNetworkInStorage(net));
    this.dispose.push(() => networkSubscription.unsubscribe());
  }
  private static readonly supportedNets: Network[] = ['TestNet', 'MainNet'];

  private static readonly baseURL = environment.baseURL;
  private static readonly helperBaseURL = environment.helperBaseURL;
  private static pollTime = 5000;

  private network = new BehaviorSubject<Network>(this.getNetworkInStorage());
  private dispose: (() => void)[] = [];

  ngOnDestroy(): void {
    this.dispose.forEach(fn => fn());
  }

  getNetwork(): Network {
    return this.network.value;
  }

  setNetwork(maybeNetwork: string): void {
    this.network.next(APIService.validNetwork(maybeNetwork));
  }

  getNetworkObservable(): Observable<Network> {
    return this.network.asObservable();
  }

  balance(address: string): Promise<BalanceResponse[]> {
    return this.http.get<BalanceResponse[]>(APIService.balanceURL(this.network.value, address)).toPromise();
  }

  transfers(address: string): Promise<TransfersResponse[]> {
    return this.http.get<TransfersResponse[]>(APIService.transfersURL(this.network.value, address)).toPromise();
  }

  council(): Promise<ConcensusNode[]> {
    return this.http.get<ConcensusNode[]>(APIService.councilURL(this.network.value)).toPromise();
  }

  candidates(): Promise<ConcensusNode[]> {
    return this.http.get<ConcensusNode[]>(APIService.candidatesURL(this.network.value)).toPromise();
  }

  allAssets(): Promise<Asset[]> {
    return this.http.get<Asset[]>(APIService.allAssetsURL(this.network.value)).toPromise();
  }

  requestTestFunds(address: string): Promise<TransactionStatusResponse[]> {
    return this.http
      .post<TransactionStatusResponse[]>(APIService.requestTestFundsURL(this.network.value), { address })
      .toPromise();
  }

  blockCount(): Promise<number> {
    return this.http
      .get<InfoResponse>(APIService.infoURL(this.network.value))
      .toPromise()
      .then(response => Number(response.lastBlock));
  }

  fees(script: string, txLength: number): Promise<FeesResponse> {
    return this.http.get<FeesResponse>(APIService.feesURL(this.network.value, script, String(txLength))).toPromise();
  }

  asset(hash: string): Promise<Asset> {
    return this.http.get<Asset>(APIService.assetURL(this.network.value, hash)).toPromise();
  }

  transactioStatus(hash: string): Promise<TransactionStatusResponse> {
    return this.http
      .get<TransactionStatusResponse>(APIService.transactionStatusURL(this.network.value, hash))
      .toPromise();
  }

  waitUntilTransactionCofirmed(txHash: string): Promise<void> {
    return new Promise(resolve => {
      let timeoutId = 0;
      const checkTx = () => {
        this.transactioStatus(txHash)
          .then(transactionStatus => transactionStatus.status === 'CONFIRMED')
          .catch(err => {
            // if http request fails, we still want to keep polling
            console.error(err);
            return false;
          })
          .then(isConfirmed => {
            if (isConfirmed) {
              resolve();
            } else {
              timeoutId = window.setTimeout(checkTx, APIService.pollTime);
            }
          });
      };
      checkTx();
      this.dispose.push(() => window.clearTimeout(timeoutId));
    });
  }

  postVoteDto(dto: any): Promise<any> {
    return this.http.post<any>(APIService.postVoteURL(this.network.value), dto).toPromise();
  }

  unclaimedDVG(address: string): Promise<string> {
    return this.http
      .get<UnclaimedDVGResponse>(APIService.unclaimedDVGURL(this.network.value, address))
      .toPromise()
      .then(response =>
        new Decimal(response.amount).div(new Decimal(10).pow(Number(response.asset.decimals))).toString()
      );
  }

  authMessageToSign(address: string): Promise<{ message: string }> {
    return this.http.get<{ message: string }>(APIService.authURL(this.network.value, address)).toPromise();
  }

  getUserInfo(address: string, authToken?: string | null): Promise<UserInfo> {
    return this.http
      .get<UserInfo>(APIService.userInfoURL(this.network.value, address), {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })
      .toPromise();
  }

  postUserInfo(userInfo: Omit<UserInfo, 'address'>, authToken: string): Promise<UserInfo> {
    return this.http
      .post<UserInfo>(APIService.userInfoURL(this.network.value), userInfo, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .toPromise();
  }

  getSignableToken(): Promise<{ signable: string; prefix: string }> {
    return this.http.get<{ signable: string; prefix: string }>(APIService.tokenURL(this.network.value)).toPromise();
  }

  broadcast(hexSerializedTx: string): Promise<BroadcastResponse> {
    return this.http.post<BroadcastResponse>(APIService.broadcastURL(this.network.value), hexSerializedTx).toPromise();
  }

  contract(hash: string): Promise<ContractResponse> {
    return this.http.get<ContractResponse>(APIService.contractURL(this.network.value, hash)).toPromise();
  }

  cnrResolve(cname: string): Promise<{ cname: string; address: string }> {
    // TODO: Move to server-side if/when supported.
    if (cname.startsWith('@') || cname.endsWith('.id.dvita.com') || (cname.includes('@') && cname.includes('.'))) {
      return this.http
        .get<{ cname: string; address: string }>(APIService.cnrResolveURL(this.network.value, cname))
        .toPromise();
    } else {
      return Promise.resolve({ cname, address: cname });
    }
  }

  getTwitterAuthUrl(address: string, authToken?: string | null): Observable<string> {
    return this.http.get(APIService.twitterAuthURL(this.network.value, address), {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      responseType: 'text',
    });
  }

  getTwitterUsername(address: string, authToken?: string | null): Observable<string> {
    return this.http.get(APIService.twitterGetUsernameURL(this.network.value, address), {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      responseType: 'text',
    });
  }

  private getNetworkInStorage(): Network {
    return APIService.validNetwork(this.sessionStorageService.getItem('network'));
  }

  private setNetworkInStorage(net: Network): void {
    this.sessionStorageService.setItem('network', net);
  }
  // TODO: There is no relatioin between Net & endpoint dns name. To remove.
  private static readonly infoURL = (net: Network) => `${APIService.baseURL(net)}/blockchain/info`;
  private static readonly feesURL = (net: Network, script: string, length: string) =>
    `${APIService.baseURL(net)}/transaction/fees/${script}/${length}`;
  private static readonly balanceURL = (net: Network, address: string) =>
    `${APIService.baseURL(net)}/wallet/balance/${address}`;
  private static readonly broadcastURL = (net: Network) => `${APIService.baseURL(net)}/transaction/broadcast`;
  private static readonly txURL = (net: Network, txId: string) =>
    `${APIService.baseURL(net)}/blockchain/transaction/hash/${txId}`;
  private static readonly transfersURL = (net: Network, address: string) =>
    `${APIService.baseURL(net)}/wallet/transfers/${address}`;
  private static readonly councilURL = (net: Network) => `${APIService.baseURL(net)}/governance/council`;
  private static readonly candidatesURL = (net: Network) => `${APIService.baseURL(net)}/governance/candidates`;
  private static readonly requestTestFundsURL = (net: Network) => `${APIService.baseURL(net)}/faucet`;
  private static readonly allAssetsURL = (net: Network) => `${APIService.baseURL(net)}/assets/all`;
  private static readonly assetURL = (net: Network, assetHash: string) =>
    `${APIService.baseURL(net)}/assets/hash/${assetHash}`;
  private static readonly transactionStatusURL = (net: Network, txHash: string) =>
    `${APIService.baseURL(net)}/transaction/status/${txHash}`;
  private static readonly postVoteURL = (net: Network) => `${APIService.baseURL(net)}/governance/vote`;
  private static readonly unclaimedDVGURL = (net: Network, address: string) =>
    `${APIService.baseURL(net)}/wallet/unclaimed/${address}`;
  private static readonly authURL = (net: Network, address: string) =>
    `${APIService.helperBaseURL(net)}/auth/${address}`;
  private static readonly userInfoURL = (net: Network, address?: string) =>
    `${APIService.helperBaseURL(net)}/user-info${address ? `/${address}` : ''}`;
  private static readonly tokenURL = (net: Network) => `${APIService.helperBaseURL(net)}/auth/token`;
  private static readonly contractURL = (net: Network, hash: string) =>
    `${APIService.baseURL(net)}/contracts/hash/${hash}`;
  private static readonly cnrResolveURL = (net: Network, cname: string) =>
    `${APIService.baseURL(net)}/cnr/resolve/${cname}`;
  private static readonly twitterAuthURL = (net: Network, address: string) =>
    `${APIService.helperBaseURL(net)}/social/auth/twitter/authurl`;
  private static readonly twitterGetUsernameURL = (net: Network, address: string) =>
    `${APIService.helperBaseURL(net)}/social/auth/twitter/username`;

  private static validNetwork(maybeNetwork: string | null | undefined): Network {
    // TODO: Fallback to environment's one.
    const network = APIService.supportedNets.includes(maybeNetwork as Network) ? (maybeNetwork as Network) : 'TestNet';
    return network;
  }
}

export type Network = 'MainNet' | 'TestNet';

export interface Asset {
  hash: string;
  code: string;
  name?: string;
  decimals?: string;
  metadata?: {
    description?: string;
    explorerUrl?: string;
    homePageUrl?: string;
    icon?: string;
    previewIcon?: string;
  };
}

export interface BalanceResponse {
  asset: Asset;
  address: string;
  amount: string;
  formatted: string;
}

export interface TransactionResponse {
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

export interface TransactionStatusResponse {
  status: TransactionStatus;
  transaction: TransactionResponse;
  error?: string;
}

export interface InfoResponse {
  blockchain: string;
  networkName: string;
  networkId: string;
  synchronized: boolean;
  lastBlock: string;
}

export interface TransfersResponse {
  type: 'RECEIVED' | 'SENT';
  blockIndex: number;
  txHash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  asset: Asset;
}

export interface ConcensusNode {
  address: string;
  publicKey: string;
  rank?: number;
  totalVotes?: number;
  isConsensusMaker: boolean;
  isCouncilMember: boolean;
  name?: string;
  description?: string;
  location?: string;
  site?: string;
  email?: string;
  github?: string;
  telegram?: string;
}

export interface FeesResponse {
  systemFee: string;
  networkFee: string;
}

export type TransactionStatus = 'NEW' | 'ANNOUNCED' | 'CONFIRMED' | 'FAILED';

export interface UnclaimedDVGResponse {
  asset: Asset;
  lastUpdatedBlockIndex: string;
  address: string;
  amount: string;
  formatted: string;
}

export interface UserInfo {
  address: string;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  dvitaId?: string;
  twitter?: string;
}

export type BroadcastResponse =
  | {
      status: 'ANNOUNCED';
      transaction: {
        hash: string;
      };
    }
  | {
      status: 'FAILED';
      error: string;
    };

export interface ContractResponse {
  code?: string;
  name?: string;
  script?: string;
  description?: string;
  metadata?: string;
  scriptHash?: string;
  address?: string;
  ownerAddress?: string;
  createdDate?: string;
  transaction?: TransactionResponse;
  token: {
    type: string;
    symbol: string;
    name: string;
    decimals: number;
    scriptHash?: string;
    address?: string;
    ownerAddress?: string;
    iconUrl?: string;
    contract?: string;
    transaction?: TransactionResponse;
  };
}
