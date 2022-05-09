import { NgModule } from '@angular/core';
import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts.component';
import { ContractsListModule } from '@app/pages/explorer/contracts/pages/contracts-list/contracts-list.module';
import { ContractsInfoModule } from '@app/pages/explorer/contracts/pages/contracts-info/contracts-info.module';

@NgModule({
  imports: [
    ContractsRoutingModule,
    ContractsListModule,
    ContractsInfoModule,
  ],
  declarations: [
    ContractsComponent
  ],
  providers: [],
})
export class ContractsModule {}
