import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './contracts.component';
import { ContractsListComponent } from '@app/pages/explorer/contracts/pages/contracts-list/contracts-list.component';
import { ContractsInfoComponent } from '@app/pages/explorer/contracts/pages/contracts-info/contracts-info.component';


const routes: Routes = [
  {
    path: '',
    component: ContractsComponent,
    children: [
      {
        path: '',
        component: ContractsListComponent
      },
      {
        path: ':hash',
        component: ContractsInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractsRoutingModule {}
