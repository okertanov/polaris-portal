import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { OurPartnersRoutingModule } from './our-partners-routing.module';
import { OurPartnersComponent } from './our-partners.component';

@NgModule({
  imports: [SharedModule, OurPartnersRoutingModule],
  declarations: [OurPartnersComponent],
  providers: [],
})
export class OurPartnersModule {}
