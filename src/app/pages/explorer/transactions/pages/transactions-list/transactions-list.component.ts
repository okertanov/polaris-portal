import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableParams } from '@app/pages/explorer/explorer.interfaces';
import { ExplorerService } from '@app/pages/explorer/explorer.service';
import { TransactionData } from '@app/pages/explorer/transactions/transactions.component';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
})
export class TransactionsListComponent implements OnInit {
  transactions: TransactionData[] = [];
  displayedColumns: string[] = ['type', 'transactionId', 'size', 'completedOn'];
  dataSource!: MatTableDataSource<TransactionData>;

  dataLength = 0;
  pageSizeOption: number[] = [10, 15, 30, 50];
  pageSize: number = this.pageSizeOption[0];
  pageIndex = 1;

  private totalTransactions = 0;
  private tableParams: TableParams = {
    from: 0,
    limit: 10,
    order: 'descending',
  };

  netValues = ['Mainnet', 'TestNet'];
  netValue = this.netValues[0];

  constructor(private router: Router, private readonly explorerService: ExplorerService) {}

  ngOnInit(): void {
    this.transactions = [
      {
        icon: 'user',
        type: 'Miner',
        transactionId: 'fe2ca04d4d68553a9d3208',
        size: '555 Bytes',
        completedOn: '27.07.2021 | 17:22:06',
      },
    ];
    this.getTableData();
  }

  getTableData(): void {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataLength = this.transactions.length;
  }

  goTransactionInfo(info: any): void {
    this.router.navigateByUrl('/transactions/1j2h3213123g12j3g12j3g1j2h');
  }

  pageChange(page: any): void {
    if (this.tableParams.limit === page.pageSize) {
      this.tableParams.from = this.totalTransactions - (page.pageIndex * page.pageSize - page.pageSize);
    }
    this.tableParams.limit = page.pageSize;
    this.getTableData();
  }
}
