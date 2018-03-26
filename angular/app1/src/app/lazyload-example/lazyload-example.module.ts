import { NgModule } from '@angular/core';

import { LazyloadTestComponent } from './lazyload-test/lazyload-test.component';

import { LazyloadRoutingModule } from './lazyload-routing/lazyload-routing.module';

@NgModule({
  declarations: [
    LazyloadTestComponent
  ],
  imports: [
    LazyloadRoutingModule
  ]
})
export class LazyloadExampleModule { }
