import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsInfoComponent } from './contracts-info.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    ContractsInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ContractsInfoComponent]
})
export class ContractsInfoModule { }
