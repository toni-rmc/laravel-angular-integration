import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { TestLazyRouteComponent } from '../test-lazy-route/test-lazy-route.component';

const routes: Routes = [
  { path: '', component: TestLazyRouteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyloadRoutesModule { }
