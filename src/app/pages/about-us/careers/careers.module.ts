import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { CareersRoutingModule } from './careers-routing.module';
import { CareersComponent } from './careers.component';

@NgModule({
  imports: [SharedModule, CareersRoutingModule],
  declarations: [CareersComponent],
  providers: [],
})
export class CareersModule {}
