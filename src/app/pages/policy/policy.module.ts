import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';

@NgModule({
  imports: [SharedModule, PolicyRoutingModule],
  declarations: [PolicyComponent],
})
export class PolicyModule {}
