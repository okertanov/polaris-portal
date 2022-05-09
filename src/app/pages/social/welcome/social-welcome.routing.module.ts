import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialWelcomeComponent } from './social-welcome.component';

const routes: Routes = [{ path: ':network', component: SocialWelcomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialWelcomeRoutingModule {}
