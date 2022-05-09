import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlockListComponent} from './block-list.component';
import {SharedModule} from '@app/shared/shared.module';
import {BlocksRoutingModule} from '@app/pages/explorer/blocks/blocks-routing.module';


@NgModule({
  declarations: [
    BlockListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BlocksRoutingModule,
  ],
  exports: [BlockListComponent]
})
export class BlockListModule {
}
