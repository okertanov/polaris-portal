import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AssetData } from '@app/pages/assets/assets.interface';
import { AssetsService } from '@app/pages/assets/assets.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss'],
})
export class ContractsListComponent implements OnInit {
  assetsList: AssetData[] = [];
  assetsDisplayedColumns: string[] = ['name', 'code', 'type', 'hash', 'createdOn'];
  assetsDataSource!: MatTableDataSource<AssetData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) assetsSort!: MatSort;

  dataLength = 0;
  pageSizeOption: number[] = [10, 15, 30, 50];
  pageSize: number = this.pageSizeOption[0];
  pageIndex = 1;
  netValues = ['Mainnet', 'TestNet'];
  netValue = this.netValues[0];

  constructor(private router: Router, private readonly assetsService: AssetsService) {}

  ngOnInit(): void {
    this.getAssets();
  }

  private getAssets(): void {
    this.assetsService
      .getAllAssets()
      .pipe(map(data => data.reverse()))
      .subscribe(assets => {
        this.assetsDataSource = new MatTableDataSource<AssetData>(assets);
        this.assetsDataSource.sort = this.assetsSort;
        this.assetsDataSource.paginator = this.paginator;
        this.dataLength = assets?.length || 0;
      });
  }

  goContract(row: AssetData): void {
    this.router.navigateByUrl(`/assets/${row.scriptHash}`);
  }

  pageChange(page: any): void {
    this.paginator.pageIndex = page.pageIndex - 1;
    this.paginator.pageSize = page.pageSize;
    this.assetsDataSource.paginator = this.paginator;
  }
}
