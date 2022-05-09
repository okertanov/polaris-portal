import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

export interface BlogData {
  imgSrc: string;
  title: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  blogList: BlogData[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataLength: number = 0;
  pageSizeOption: number[] = [10, 15, 30, 50];
  pageSize: number = this.pageSizeOption[0];
  pageIndex: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.blogList = [
      {
        imgSrc: 'assets/imgs/blog/blog1.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog2.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog3.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog3.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog1.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog2.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog2.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog3.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
      {
        imgSrc: 'assets/imgs/blog/blog1.png',
        title: 'Bitcoin Statistics in our country',
        description:
          'Download the complete package including the desktop wallet, network node and tools Download the complete package including the desktop wallet, network node and tools',
        date: '22.02.2021',
      },
    ];
    this.dataLength = this.blogList.length;
  }

  pageChange(page: any) {
    this.paginator.pageIndex = page.pageIndex - 1;
    this.paginator.pageSize = page.pageSize;
  }
}
