import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TopBarRoutingModule } from './top-bar-routing.module';
import { TopBarComponent } from './top-bar.component';

@NgModule({
  imports: [SharedModule, TopBarRoutingModule],
  declarations: [TopBarComponent],
  providers: [],
})
export class TopBarModule {}
