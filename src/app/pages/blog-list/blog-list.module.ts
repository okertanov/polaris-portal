import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { BlogListRoutingModule } from './blog-list-routing.module';
import { BlogListComponent } from './blog-list.component';

@NgModule({
  imports: [SharedModule, BlogListRoutingModule],
  declarations: [BlogListComponent],
  providers: [],
})
export class BlogListModule {}
