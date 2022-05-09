import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExplorerService } from '@app/pages/explorer/explorer.service';
import { AssetsService } from '../../assets.service';

export interface AssetsDatas {
  code: string;
  name: string;
  script: string;
  description: string;
  metadata: string;
  scriptHash: string;
  address: string;
  ownerAddress: string;
  createdDate: string;
  transaction: {
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
    timestamp: 0;
  };
  token: {
    type: string;
    symbol: string;
    name: string;
    decimals: 0;
    scriptHash: string;
    address: string;
    ownerAddress: string;
    iconUrl: string;
    contract: string;
    transaction: {
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
      timestamp: 0;
    };
  };
}

@Component({
  selector: 'app-assets-info',
  templateUrl: './assets-info.component.html',
  styleUrls: ['./assets-info.component.scss'],
})
export class AssetsInfoComponent implements OnInit {
  netValues = ['Mainnet', 'TestNet'];
  netValue = this.netValues[0];

  searchValue = '';
  asset!: AssetsDatas;

  constructor(
    private readonly explorerService: ExplorerService,
    private readonly assetsService: AssetsService,
    private readonly router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const scriptHash = this.router.snapshot.params.scriptHash;
    this.assetsService.getAssetsByHash(scriptHash).subscribe(res => {
      this.asset = res;
    });
  }

  makeSearch(): void {
    this.explorerService.search(this.searchValue);
  }
}
