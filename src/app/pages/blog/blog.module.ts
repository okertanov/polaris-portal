import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';

@NgModule({
  imports: [SharedModule, BlogRoutingModule],
  declarations: [BlogComponent],
  providers: [],
})
export class BlogModule {}
