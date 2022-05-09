import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { MultisigWalletRoutingModule } from './multisig-wallet-routing.module';
import { MultisigWalletComponent } from './multisig-wallet.component';

@NgModule({
  declarations: [MultisigWalletComponent],
  imports: [SharedModule, MultisigWalletRoutingModule],
  exports: [MultisigWalletComponent],
})
export class MultisigWalletModule {}
