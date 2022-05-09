import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { BlockInfomationRoutingModule } from './block-infomation-routing.module';
import { BlockInfomationComponent } from './block-infomation.component';

@NgModule({
  imports: [SharedModule, BlockInfomationRoutingModule, ClipboardModule],
  declarations: [BlockInfomationComponent],
  providers: [],
  exports: [BlockInfomationComponent],
})
export class BlockInfomationModule {}
