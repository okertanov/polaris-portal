import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { ClaimConfirmComponent } from './claim-confirm/claim-confirm.component';
import { NodeElectionRoutingModule } from './node-election-routing.module';
import { NodeElectionComponent } from './node-election.component';

@NgModule({
  imports: [SharedModule, NodeElectionRoutingModule],
  declarations: [NodeElectionComponent, ClaimConfirmComponent],
  providers: [],
})
export class NodeElectionModule {}
