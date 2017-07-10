import { NgModule }              from '@angular/core';

import { LazyloadTestComponent } from './lazyload-test.component';

import { LazyloadRoutingModule } from './lazyload-routing.module';

@NgModule({
  imports:      [ LazyloadRoutingModule ],
  declarations: [ LazyloadTestComponent ],
})
export class LazyloadModule {}
