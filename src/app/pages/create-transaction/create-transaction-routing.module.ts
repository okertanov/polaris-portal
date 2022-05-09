import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTransactionComponent } from '@app/pages/create-transaction/create-transaction.component';

const routes: Routes = [{ path: '', component: CreateTransactionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTransactionRoutingModule {}
