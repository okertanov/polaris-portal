import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { BuildNowRoutingModule } from './build-now-routing.module';
import { BuildNowComponent } from './build-now.component';

@NgModule({
  imports: [SharedModule, BuildNowRoutingModule],
  declarations: [BuildNowComponent],
  providers: [],
})
export class BuildNowModule {}
