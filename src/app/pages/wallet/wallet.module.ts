import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';

@NgModule({
  imports: [SharedModule, WalletRoutingModule],
  declarations: [WalletComponent],
  providers: [],
})
export class WalletModule {}
