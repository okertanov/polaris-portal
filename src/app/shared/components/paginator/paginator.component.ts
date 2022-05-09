import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

export interface PageData {
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOption: number[];
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges {
  pageIndex: number = 1;
  length: number = 1;
  pageIndexs: number[] = [];
  prePageIndexs: number[] = [];
  postPageIndexs: number[] = [];

  @Input() dataLength = 0;
  @Input() pageSize = 0;
  @Input() pageSizeOption: number[] = [10, 15, 30, 50];
  @Output() onPage = new EventEmitter<any>();

  constructor() {
    this.length = 8;
    // this.calculatePages();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.calLength();
    this.calculatePages();
  }

  calLength() {
    this.length = Math.floor(this.dataLength / this.pageSize) + 1;
    // if (this.dataLength % this.pageSize === 0) {
    //   this.length = Math.floor(this.dataLength / this.pageSize) + this.length;
    //   console.log(this.length, "if");
    // } else {
    //   this.length = Math.floor(this.dataLength / this.pageSize) + 1;
    //   console.log(this.length, "else");
    // }
  }

  calculatePages() {
    const pageIndexs = Array(this.length)
      .fill(1)
      .map((page: number, i: number) => i + 1);
    this.pageIndexs = pageIndexs;
    if (pageIndexs.length > 4) {
      this.prePageIndexs = [1, 2];
      this.postPageIndexs = [pageIndexs.length - 1, pageIndexs.length];
    }
  }

  setPage(page: number) {
    if(this.pageIndex === page) return;
    this.pageIndex = page;
    this.emitPageEvent();
  }

  onPrev() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.emitPageEvent();
    }
  }

  onNext() {
    if (this.pageIndex < this.length) {
      this.pageIndex++;
      this.emitPageEvent();
    }
  }

  firstPage() {
    this.pageIndex = 1;

    console.log(this.pageIndex);
    console.log(this.pageSize);
    this.emitPageEvent();
  }

  lastPage() {
    this.pageIndex = this.length;
    this.emitPageEvent();
  }

  emitPageEvent() {
    this.onPage.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }

  changePageSize(e: any) {
    const pageSize = Number(e.target.value);
    this.pageSize = pageSize;
    this.calLength();
    this.calculatePages();
    if (this.pageIndex > this.length) this.pageIndex = this.length;
    this.emitPageEvent();
  }
}
