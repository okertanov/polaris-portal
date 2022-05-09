import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms.component';

@NgModule({
  imports: [SharedModule, TermsRoutingModule],
  declarations: [TermsComponent],
})
export class TermsModule {}
