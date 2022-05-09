import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from '@app/../environments/environment';
import { APIService } from '@app/shared/services/api.service';
import { AuthService, User } from '@app/shared/services/auth.service';
import { SessionStorageService } from '@app/shared/services/session-storage.service';
import { SnackBarService } from '@app/shared/services/snack-bar.service';
import { TransactionService } from '@app/shared/services/transaction.service';
import { WalletPluginService } from '@app/shared/services/wallet/wallet.plugin.service';
import Decimal from 'decimal.js';
import { ClaimConfirmComponent } from './claim-confirm/claim-confirm.component';

export interface NodeData {
  rank: number;
  name: string;
  address: string;
  publicKey: string;
  location: string;
  votes: string;
  percentageOfVotes: string;
  checked: boolean;
  voted: boolean;
  isConsensusMaker: boolean;
  isCouncilMember: boolean;
}

// TODO: 1B not 100M
// TODO: Move inside usage scope
const totalDVITASupply = 100_000_000;

@Component({
  selector: 'app-node-election',
  templateUrl: './node-election.component.html',
  styleUrls: ['./node-election.component.scss'],
})
export class NodeElectionComponent implements OnInit, OnDestroy {
  constructor(
    private readonly dialog: MatDialog,
    private readonly snackBarService: SnackBarService,
    private readonly apiService: APIService,
    private readonly walletPluginService: WalletPluginService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly transactionService: TransactionService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}
  nodes: NodeData[] = [];
  displayedColumns = ['no', 'name', 'publicKey', 'location', 'votes' /*TODO: hidden: 'percentageOfVotes'*/];
  dataSource = new MatTableDataSource(this.nodes);
  @ViewChild(MatSort) sort!: MatSort;
  voted = false;
  user: User | null = null;
  fetchFinished = false;
  votedFor: { name: string; publicKey: string } | undefined = undefined;
  unclaimedDVG = '';

  private voteContractHash = '';
  private unsubscribe: (() => void)[] = [];
  private unclaimedDVGFetchIntervalId = 0;

  ngOnInit(): void {
    const subUser = this.authService.userObservable.subscribe(user => {
      this.user = user;
      this.votedFor = user ? this.getVotedForByWallet()[user.wallet.account.address] : undefined;
    });
    this.unsubscribe.push(() => subUser.unsubscribe());
    const subNetwork = this.apiService.getNetworkObservable().subscribe(() => {
      this.fetchAndUpdate();
    });
    this.unsubscribe.push(() => subNetwork.unsubscribe());
    this.startPeriodicFetchUnclaimedDVG();
    this.fetchUnclaimedDVG();
    this.unsubscribe.push(() => this.stopPeriodicFetchUnclaimedDVG());
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(unsub => unsub());
    this.unsubscribe.length = 0;
  }

  private fetchAndUpdate(): void {
    this.fetchFinished = false;
    this.nodes = [];
    this.dataSource = new MatTableDataSource(this.nodes);

    Promise.all([this.fetchCandidates(), this.fetchVoteContractHash()])
      .catch(err => {
        this.snackBarService.show(err.message);
      })
      .then(() => {
        this.fetchFinished = true;
      });
  }

  private fetchVoteContractHash(): Promise<void> {
    return this.apiService.allAssets().then(assets => {
      const dvita = assets.find(asset => asset.code === 'DVITA');
      if (!dvita) {
        console.error('Could not find hash for vote contract (DVITA)');
        return;
      }
      this.voteContractHash = dvita.hash;
    });
  }

  private fetchCandidates(): Promise<void> {
    return this.apiService.candidates().then(nodes => {
      this.nodes = nodes.map(node => ({
        rank: node.rank ?? 0,
        name: node.name ?? '',
        address: node.address,
        publicKey: node.publicKey,
        location: node.location ?? '',
        votes: (node.totalVotes ?? 0).toLocaleString(),
        percentageOfVotes: new Decimal(node.totalVotes || 0).div(totalDVITASupply).mul(100).toString(),
        checked: this.votedFor?.publicKey === node.publicKey,
        voted: false,
        isConsensusMaker: node.isConsensusMaker,
        isCouncilMember: node.isCouncilMember,
      }));
      this.dataSource = new MatTableDataSource(this.nodes);
      this.dataSource.sort = this.sort;
    });
  }

  onRowClick(node: NodeData): void {
    this.nodes.forEach(n => {
      n.checked = n === node ? !n.checked : false;
    });
  }

  login(): void {
    this.router.navigateByUrl('login', { state: { from: 'node-election' } });
  }

  claim(): void {
    if (!this.user) {
      throw new Error('Please log in first');
    }

    const address = this.user.wallet.account.address;
    const providerName = this.user.wallet.providerName;
    this.confirmClaim(address)
      .then(() => this.transactionService.createTransfer(address, address, environment.tokenHashDVITA, 1))
      .then(params => this.walletPluginService.signAndAnnounceTx(providerName, params))
      .then(({ txid }) => {
        this.unclaimedDVG = '';
        this.stopPeriodicFetchUnclaimedDVG();
        return this.apiService.waitUntilTransactionCofirmed(txid);
      })
      .then(() => {
        this.unclaimedDVG = '0';
        this.startPeriodicFetchUnclaimedDVG();
      })
      .catch(err => {
        const msg = 'message' in err ? err.message : String(err);
        if (msg.startsWith('User')) {
          console.warn(err);
        } else {
          console.error(err);
          this.snackBarService.show(msg);
        }
      });
  }
  private confirmClaim(address: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dialogRef = this.dialog.open(ClaimConfirmComponent, { data: { address } });
      dialogRef.afterClosed().subscribe((result: boolean) => (result ? resolve() : reject('User canceled')));
    });
  }

  private startPeriodicFetchUnclaimedDVG(): void {
    this.unclaimedDVGFetchIntervalId = window.setInterval(() => this.fetchUnclaimedDVG(), 5000);
  }

  private stopPeriodicFetchUnclaimedDVG(): void {
    window.clearTimeout(this.unclaimedDVGFetchIntervalId);
  }

  private fetchUnclaimedDVG(): void {
    if (this.user) {
      this.apiService.unclaimedDVG(this.user.wallet.account.address).then(amount => {
        this.unclaimedDVG = amount;
      });
    }
  }

  async onVoteClick(): Promise<void> {
    try {
      await this.startVoteFlow();
    } catch (e: any) {
      console.error(e);
      this.snackBarService.show(e.message ?? String(e));
    }
  }

  private async startVoteFlow(): Promise<void> {
    if (!this.user) {
      throw new Error('Please connect wallet first');
    }

    const checkedNode = this.nodes.find(node => node.checked);
    if (!checkedNode) {
      throw new Error('Please select a node first');
    }

    const voterAddress = this.user.wallet.account.address;
    const voterPublicKey = await this.walletPluginService.getPublicKey(this.user.wallet.providerName);
    const candidatePublicKey = checkedNode.publicKey;

    const dto = {
      voterAddress,
      voterPublicKey,
      candidatePublicKey,
    };

    const result = await this.apiService.postVoteDto(dto);

    if (!result.rawTx || result.rawTx.length <= 0) {
      throw new Error('Empty Vote transaction received');
    }

    const createdTx = JSON.parse(result.rawTx);
    const { txid } = await this.walletPluginService.invoke(this.user.wallet.providerName, createdTx);

    const prevVotedFor = this.votedFor;
    this.setVotedFor({ name: checkedNode.name, publicKey: checkedNode.publicKey });

    this.nodes.forEach(node => {
      if ((prevVotedFor && node.publicKey === prevVotedFor.publicKey) || node.publicKey === candidatePublicKey) {
        node.votes = '⏳';
      }
    });
    this.apiService.waitUntilTransactionCofirmed(txid).then(() => this.fetchCandidates());
  }

  private getVotedForByWallet(): Record<string, { name: string; publicKey: string }> {
    const votedForByWalletRaw = this.sessionStorageService.getItem('votedForByWallet');
    return votedForByWalletRaw ? JSON.parse(votedForByWalletRaw) : {};
  }

  private setVotedFor(votedFor: { name: string; publicKey: string }): void {
    this.votedFor = votedFor;

    if (this.user) {
      this.sessionStorageService.setItem(
        'votedForByWallet',
        JSON.stringify({
          ...this.getVotedForByWallet(),
          [this.user.wallet.account.address]: votedFor,
        })
      );
    }
  }
}
