import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockInfomationComponent } from './block-infomation.component';

const routes: Routes = [{ path: '', component: BlockInfomationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockInfomationRoutingModule {}
