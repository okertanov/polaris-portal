import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface MonitorData {
  endpoint: string;
  type: string;
  isItUp: string;
  availability: string;
  stateHeight: string;
  blockHeight: string;
  version: string;
  peers: string;
}

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit, AfterViewInit {
  monitors: MonitorData[] = [];
  displayedColumns: string[] = [
    'endpoint',
    'type',
    'isItUp',
    'availability',
    'stateHeight',
    'blockHeight',
    'version',
    'peers',
  ];
  dataSource!: MatTableDataSource<MonitorData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('monitorTable', { read: MatSort, static: true }) sort!: MatSort;

  dataLength: number = 0;
  pageSizeOption: number[] = [10, 15, 30, 50];
  pageSize: number = this.pageSizeOption[0];
  pageIndex: number = 1;

  netValues = ['Mainnet', 'TestNet'];
  netValue = this.netValues[0];

  constructor() {}

  ngOnInit(): void {
    this.monitors = [
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'green',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'yellow',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'yellow',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'yellow',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'yellow',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'yellow',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'yellow',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
      {
        endpoint: 'https://seed3.switcheo....',
        type: 'RPC',
        isItUp: 'yellow',
        availability: '99,36%',
        stateHeight: '7777656 ',
        blockHeight: '7777657',
        version: '/Neo:2.12.2/',
        peers: '80',
      },
    ];
    this.dataSource = new MatTableDataSource(this.monitors);
    this.dataSource.sort = this.sort;
    this.dataLength = this.monitors.length;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  pageChange(page: any) {
    this.paginator.pageIndex = page.pageIndex - 1;
    this.paginator.pageSize = page.pageSize;
    this.dataSource.paginator = this.paginator;
  }
}
