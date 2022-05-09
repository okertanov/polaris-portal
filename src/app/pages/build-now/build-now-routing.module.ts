import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildNowComponent } from './build-now.component';

const routes: Routes = [{ path: '', component: BuildNowComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildNowRoutingModule {}
