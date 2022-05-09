import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { ComplianceRoutingModule } from './compliance-routing.module';
import { ComplianceComponent } from './compliance.component';

@NgModule({
  imports: [SharedModule, ComplianceRoutingModule],
  declarations: [ComplianceComponent],
  providers: [],
})
export class ComplianceModule {}
