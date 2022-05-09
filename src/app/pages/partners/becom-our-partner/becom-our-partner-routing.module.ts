import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BecomOurPartnerComponent } from './becom-our-partner.component';

const routes: Routes = [{ path: '', component: BecomOurPartnerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BecomOurPartnerRoutingModule {}
