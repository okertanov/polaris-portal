import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AssetsRoutingModule } from '@app/pages/assets/assets-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { AssetsComponent } from './assets.component';
import { AssetsManagerComponent } from './pages/asset-manager/assets-manager.component';
import { AssetsInfoComponent } from './pages/assets-info/assets-info.component';

@NgModule({
  declarations: [AssetsComponent, AssetsManagerComponent, AssetsInfoComponent],
  imports: [CommonModule, AssetsRoutingModule, ReactiveFormsModule, SharedModule, ClipboardModule],
  exports: [AssetsComponent],
})
export class AssetsModule {}
