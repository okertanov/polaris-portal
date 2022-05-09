import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultisigWalletComponent } from '@app/pages/multisig-wallet/multisig-wallet.component';

const routes: Routes = [{ path: '', component: MultisigWalletComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultisigWalletRoutingModule {}
