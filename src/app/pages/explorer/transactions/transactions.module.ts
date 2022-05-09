import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionsListModule } from '@app/pages/explorer/transactions/pages/transactions-list/transactions-list.module';
import { TransactionInformationModule } from '@app/pages/explorer/transactions/pages/transaction-information/transaction-information.module';

@NgModule({
  imports: [
    SharedModule,
    TransactionsRoutingModule,
    TransactionsListModule,
    TransactionInformationModule
  ],
  declarations: [TransactionsComponent],
  providers: [],
})
export class TransactionsModule {}
