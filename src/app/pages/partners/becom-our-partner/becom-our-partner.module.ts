import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { BecomOurPartnerRoutingModule } from './becom-our-partner-routing.module';
import { BecomOurPartnerComponent } from './becom-our-partner.component';

@NgModule({
  imports: [SharedModule, BecomOurPartnerRoutingModule],
  declarations: [BecomOurPartnerComponent],
  providers: [],
})
export class BecomOurPartnerModule {}
