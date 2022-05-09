import { NgModule } from '@angular/core';
import { TransactionInformationRoutingModule } from './transaction-information-routing.module';
import { TransactionInformationComponent } from './transaction-information.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [SharedModule, TransactionInformationRoutingModule],
  declarations: [TransactionInformationComponent],
  providers: [],
})
export class TransactionInformationModule {}
