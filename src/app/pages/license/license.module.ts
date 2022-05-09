import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { LicenseRoutingModule } from './license-routing.module';
import { LicenseComponent } from './license.component';

@NgModule({
  imports: [SharedModule, LicenseRoutingModule],
  declarations: [LicenseComponent],
})
export class LicenseModule {}
