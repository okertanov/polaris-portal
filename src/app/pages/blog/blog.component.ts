import { Component, OnInit } from '@angular/core';

export interface BlogData {
  imgSrc: string;
  title: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blogList: BlogData[] = [];

  constructor() {}

  ngOnInit(): void {
    this.blogList = [
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
  }
}
