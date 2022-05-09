import {NgModule} from '@angular/core';
import {BlocksRoutingModule} from './blocks-routing.module';
import {BlocksComponent} from './blocks.component';
import {BlockListModule} from '@app/pages/explorer/blocks/pages/block-list/block-list.module';
import {BlockInfomationModule} from '@app/pages/explorer/blocks/pages/block-infomation/block-infomation.module';

@NgModule({
  imports: [
    BlocksRoutingModule,
    BlockListModule,
    BlockInfomationModule
  ],
  declarations: [BlocksComponent],
  providers: [],
})
export class BlocksModule {
}
