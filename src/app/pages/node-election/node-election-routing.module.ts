import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NodeElectionComponent } from './node-election.component';

const routes: Routes = [{ path: '', component: NodeElectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NodeElectionRoutingModule {}
