import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoryChartType, IgxMarkerTypeCollection, LegendOrientation } from 'igniteui-angular-charts';
// import { ChartOptions } from 'chart.js';
// import { Color, Label } from 'ng2-charts';

// import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
// import { Color, Label } from 'ng2-charts';

export interface TransactionData {
  icon: string;
  type: string;
  transactionId: string;
  size: string;
  completedOn: string;
}

export interface AssetData {
  icon: string;
  name: string;
  type: string;
  blocks: string;
  createdOn: string;
  transactions: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  transactions!: TransactionData[];
  transactionsDisplayedColumns: string[] = ['type', 'transactionId', 'size', 'completedOn'];
  transactionsDataSource!: MatTableDataSource<TransactionData>;
  @ViewChild(MatSort) transactionsSort!: MatSort;

  assetsList!: AssetData[];
  assetsDisplayedColumns: string[] = ['name', 'type', 'blocks', 'createdOn', 'transactions'];
  assetsDataSource!: MatTableDataSource<AssetData>;
  @ViewChild(MatSort) assetsSort!: MatSort;

  chartType: string = 'day';

  /** Statistics Chart */
  categoryChartType: CategoryChartType = 0;
  legend = 'legend';
  public data: any[];
  outlines = ['#43AE44', '#742D80', '#FFAB48'];
  brushes = ['#43AE44', '#742D80', '#FFAB48'];
  markerBrushes = ['white'];
  markerTypes: IgxMarkerTypeCollection = new IgxMarkerTypeCollection([3]);
  orientation: LegendOrientation = 0;

  netValues = ['Mainnet', 'TestNet'];
  netValue = this.netValues[0];

  constructor(private router: Router) {
    this.data = [
      { time: '2.pm', BTC: 31, ETH: 21, USDT: 19 },
      { time: '4.pm', BTC: 43, ETH: 26, USDT: 24 },
      { time: '6.pm', BTC: 66, ETH: 29, USDT: 28 },
      { time: '8.pm', BTC: 69, ETH: 32, USDT: 26 },
      { time: '10.pm', BTC: 58, ETH: 47, USDT: 38 },
      { time: '12.pm', BTC: 40, ETH: 46, USDT: 31 },
      { time: '2.am', BTC: 78, ETH: 50, USDT: 19 },
      { time: '4.am', BTC: 13, ETH: 90, USDT: 52 },
      { time: '6.am', BTC: 78, ETH: 132, USDT: 50 },
      { time: '8.am', BTC: 40, ETH: 134, USDT: 34 },
      { time: '10.am', BTC: 80, ETH: 96, USDT: 38 },
      { time: '12.am', BTC: 74, ETH: 93, USDT: 32 },
    ];
  }

  ngOnInit(): void {
    this.transactions = [
      {
        icon: 'user',
        type: 'Miner',
        transactionId: 'fe2ca04d4d68553a9d3208...',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
      {
        icon: 'send',
        type: 'Invocation',
        transactionId: 'fe2ca04d4d68553a9d3208...',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
      {
        icon: 'send',
        type: 'Invocation',
        transactionId: 'fe2ca04d4d68553a9d3208...',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
      {
        icon: 'box',
        type: 'Contract',
        transactionId: 'fe2ca04d4d68553a9d3208...',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
      {
        icon: 'box',
        type: 'Contract',
        transactionId: 'fe2ca04d4d68553a9d3208...',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
      {
        icon: 'send',
        type: 'Invocation',
        transactionId: 'fe2ca04d4d68553a9d3208...',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
      {
        icon: 'send',
        type: 'Invocation',
        transactionId: 'fe2ca04d4d68553a9d3208...',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
    ];
    this.transactionsDataSource = new MatTableDataSource(this.transactions);
    this.transactionsDataSource.sort = this.transactionsSort;

    this.assetsList = [
      {
        icon: 'grid',
        name: 'GAS',
        type: 'Utility Token',
        blocks: '7 728 630',
        createdOn: '27.07.2021 | 17:22:06',
        transactions: '567 345',
      },
      {
        icon: 'box',
        name: 'GEO',
        type: 'Governing Token',
        blocks: '7 728 630',
        createdOn: '27.07.2021 | 17:22:06',
        transactions: '567 345',
      },
      {
        icon: 'box',
        name: 'GEO',
        type: 'Governing Token',
        blocks: '7 728 630',
        createdOn: '27.07.2021 | 17:22:06',
        transactions: '567 345',
      },
      {
        icon: 'grid',
        name: 'GAS',
        type: 'Utility Token',
        blocks: '7 728 630',
        createdOn: '27.07.2021 | 17:22:06',
        transactions: '567 345',
      },
    ];
    this.assetsDataSource = new MatTableDataSource(this.assetsList);
    this.assetsDataSource.sort = this.assetsSort;
  }

  goSubPage(subPage: string) {
    this.router.navigateByUrl(subPage);
  }
}
