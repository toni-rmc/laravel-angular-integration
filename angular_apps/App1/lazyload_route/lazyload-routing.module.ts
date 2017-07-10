import { NgModule }                 from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';

import { LazyloadTestComponent }    from './lazyload-test.component';

const routes: Routes = [
  { path: '', component: LazyloadTestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyloadRoutingModule {}
