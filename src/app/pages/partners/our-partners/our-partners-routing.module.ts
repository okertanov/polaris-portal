import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurPartnersComponent } from './our-partners.component';

const routes: Routes = [{ path: '', component: OurPartnersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OurPartnersRoutingModule {}
