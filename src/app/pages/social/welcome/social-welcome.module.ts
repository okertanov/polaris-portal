import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SocialWelcomeComponent } from './social-welcome.component';
import { SocialWelcomeRoutingModule } from './social-welcome.routing.module';

@NgModule({
  imports: [SharedModule, SocialWelcomeRoutingModule],
  declarations: [SocialWelcomeComponent],
})
export class SocialWelcomeModule {}
