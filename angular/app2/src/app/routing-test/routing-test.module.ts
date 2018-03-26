import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestLazyRouteComponent } from './test-lazy-route/test-lazy-route.component';

import { LazyloadRoutesModule } from './lazyload-routes/lazyload-routes.module';

@NgModule({
  imports: [
    CommonModule, LazyloadRoutesModule
  ],
  declarations: [TestLazyRouteComponent]
})
export class RoutingTestModule { }
