import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BlockForTable, TableParams } from '@app/pages/explorer/explorer.interfaces';
import { ExplorerService } from '@app/pages/explorer/explorer.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss'],
})
export class BlockListComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  blocks: BlockForTable[] = [];
  dataSource!: MatTableDataSource<BlockForTable>;
  displayedColumns: string[] = ['height', 'time', 'size', 'createdOn', 'transactions'];

  dataLength = 0;
  pageSizeOption: number[] = [10, 15, 30, 50];
  pageSize: number = this.pageSizeOption[0];

  netValues = ['MainNet', 'TestNet'];
  netValue = this.netValues[0];

  private totalBlocks = 0;
  private tableParams: TableParams = {
    from: 0,
    limit: 10,
    order: 'descending',
  };

  constructor(private readonly router: Router, private readonly explorerService: ExplorerService) {}

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(): void {
    this.explorerService
      .get('blockchain/info', { params: null })
      .pipe(
        switchMap(info => {
          this.totalBlocks = +info.lastBlock;
          if (!this.tableParams.from) {
            this.tableParams.from = this.totalBlocks;
          }
          this.dataLength = this.totalBlocks;
          return this.explorerService.get('explorer/blocks', this.tableParams);
        })
      )
      .pipe(map(data => this.explorerService.prepareBlocksData(data)))
      .subscribe(blocks => (this.dataSource = new MatTableDataSource(blocks)));
  }

  navigateTo(row: BlockForTable): void {
    this.router.navigateByUrl(`/blocks/${row.hash}`);
  }

  // goBlockInfo(index: number) {
  //   this.router.navigateByUrl("/block-info");
  // }

  pageChange(page: { pageIndex: number; pageSize: number }): void {
    if (this.tableParams.limit === page.pageSize) {
      this.tableParams.from = this.totalBlocks - (page.pageIndex * page.pageSize - page.pageSize);
    }
    this.tableParams.limit = page.pageSize;
    this.getTableData();
  }
}
