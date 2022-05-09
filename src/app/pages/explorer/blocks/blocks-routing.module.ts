import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlocksComponent} from './blocks.component';
import {BlockListComponent} from '@app/pages/explorer/blocks/pages/block-list/block-list.component';
import {BlockInfomationComponent} from '@app/pages/explorer/blocks/pages/block-infomation/block-infomation.component';

const routes: Routes = [
  {
    path: '',
    component: BlocksComponent,
    children: [
      {
        path: '',
        component: BlockListComponent
      },
      {
        path: ':hash',
        component: BlockInfomationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlocksRoutingModule {
}
