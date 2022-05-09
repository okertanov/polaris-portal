import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyComponent } from './verify.component';

@NgModule({
  declarations: [VerifyComponent],
  imports: [SharedModule, VerifyRoutingModule],
  exports: [VerifyComponent],
})
export class VerifyModule {}
