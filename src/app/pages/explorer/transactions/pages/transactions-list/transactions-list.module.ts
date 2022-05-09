import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsListComponent } from './transactions-list.component';
import { TransactionsListRoutingModule } from '@app/pages/explorer/transactions/pages/transactions-list/transactions-list-routing.module';
import { SharedModule } from '@app/shared/shared.module';



@NgModule({
  declarations: [
    TransactionsListComponent
  ],
  imports: [
    CommonModule,
    TransactionsListRoutingModule,
    SharedModule
  ],
  exports: [TransactionsListComponent]
})
export class TransactionsListModule { }
