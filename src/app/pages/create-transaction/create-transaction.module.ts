import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { CreateTransactionRoutingModule } from './create-transaction-routing.module';
import { CreateTransactionComponent } from './create-transaction.component';

@NgModule({
  declarations: [CreateTransactionComponent],
  imports: [SharedModule, CreateTransactionRoutingModule],
  exports: [CreateTransactionComponent],
})
export class CreateTransactionModule {}
