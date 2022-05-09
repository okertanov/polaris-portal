import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AssetsInfoComponent } from './assets-info.component';

@NgModule({
  declarations: [AssetsInfoComponent],
  imports: [CommonModule, SharedModule],
  exports: [AssetsInfoComponent],
})
export class ContractsInfoModule {}
