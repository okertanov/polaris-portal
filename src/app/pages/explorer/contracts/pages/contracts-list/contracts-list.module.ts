import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsListComponent } from './contracts-list.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    ContractsListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ContractsListComponent]
})
export class ContractsListModule {
}
