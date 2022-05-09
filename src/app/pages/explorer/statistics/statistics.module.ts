import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [SharedModule, StatisticsRoutingModule],
  declarations: [StatisticsComponent],
  providers: [],
})
export class StatisticsModule {}
