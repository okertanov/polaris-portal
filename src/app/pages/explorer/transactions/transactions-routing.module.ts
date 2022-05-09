import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { TransactionInformationComponent } from '@app/pages/explorer/transactions/pages/transaction-information/transaction-information.component';
import { TransactionsListComponent } from '@app/pages/explorer/transactions/pages/transactions-list/transactions-list.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    children: [
      {
        path: '',
        component: TransactionsListComponent
      },
      {
        path: ':hash',
        component: TransactionInformationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {
}
