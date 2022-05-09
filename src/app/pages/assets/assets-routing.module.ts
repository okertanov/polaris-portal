import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsComponent } from '@app/pages/assets/assets.component';
import { AssetsManagerComponent } from './pages/asset-manager/assets-manager.component';
import { AssetsInfoComponent } from './pages/assets-info/assets-info.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsComponent,
    children: [
      {
        path: '',
        redirectTo: 'deploy',
      },
      {
        path: 'deploy',
        component: AssetsManagerComponent,
      },
      {
        path: ':scriptHash',
        component: AssetsInfoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsRoutingModule {}
