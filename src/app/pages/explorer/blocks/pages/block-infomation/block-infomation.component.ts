import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockInfo } from '@app/pages/explorer/explorer.interfaces';
import { ExplorerService } from '@app/pages/explorer/explorer.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TransactionData {
  icon: string;
  type: string;
  transactionId: string;
  size: string;
  completedOn: string;
}

@Component({
  selector: 'app-block-infomation',
  templateUrl: './block-infomation.component.html',
  styleUrls: ['./block-infomation.component.scss'],
})
export class BlockInfomationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  transactions: TransactionData[] = [];
  displayedColumns: string[] = ['type', 'transactionId', 'size', 'completedOn'];
  dataSource!: MatTableDataSource<TransactionData>;
  dataLength = 0;
  pageSizeOption: number[] = [10, 15, 30, 50];
  pageSize: number = this.pageSizeOption[0];
  pageIndex = 1;

  searchValue = '';

  netValues = ['Mainnet', 'TestNet'];
  netValue = this.netValues[0];

  blockInfo$!: Observable<BlockInfo>;
  invocationScript = '';
  verificationScript = '';

  private hash = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly explorerService: ExplorerService
  ) {
    this.route.paramMap.subscribe(_ => this.getByHash());
  }

  ngOnInit(): void {
    this.getByHash();
  }

  makeSearch(): void {
    this.explorerService.search(this.searchValue);
  }

  navigateTo(hash: string): void {
    this.router.navigateByUrl(`/transactions/${hash}`);
  }

  pageChange(page: any): void {
    this.paginator.pageIndex = page.pageIndex - 1;
    this.paginator.pageSize = page.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  private getByHash(): void {
    this.hash = this.route.snapshot.params?.hash;
    this.blockInfo$ = this.explorerService.get(`explorer/block/${this.hash}`).pipe(
      map(data => {
        const info = data;
        this.invocationScript = info?.witnesses?.[0]?.invocation || '-- --';
        this.verificationScript = info?.witnesses?.[0]?.verification || '-- --';
        this.transactions = info.transactions;
        this.dataSource = new MatTableDataSource(this.transactions);
        this.dataLength = this.transactions.length;
        info.createdOn = moment(data.timestamp).format('DD.MM.YYYY | hh:mm:ss');
        info.time = moment(data.timestamp).fromNow();
        return info;
      })
    );
  }
}
