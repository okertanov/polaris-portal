import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionInformationComponent } from './transaction-information.component';

const routes: Routes = [{ path: '', component: TransactionInformationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionInformationRoutingModule {}
