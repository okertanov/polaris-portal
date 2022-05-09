import { Component, OnInit } from '@angular/core';


export interface TransactionData {
  icon: string;
  type: string;
  transactionId: string;
  size: string;
  completedOn: string;
}

@Component({
  selector: 'app-transactions',
  template: '<router-outlet></router-outlet>',
})
export class TransactionsComponent implements OnInit {

  ngOnInit(): void {
  }
}
