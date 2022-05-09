import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team.component';

@NgModule({
  imports: [SharedModule, TeamRoutingModule],
  declarations: [TeamComponent],
  providers: [],
})
export class TeamModule {}
