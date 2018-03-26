import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestRoutingComponent } from './test-routing/test-routing.component';

export const routes: Routes = [
  { path: 'eager/load', component: TestRoutingComponent},
  { path: 'testlazyload', loadChildren: 'app/routing-test/routing-test.module#RoutingTestModule' },
  { path: 'lazy/load', loadChildren: 'app/lazyload-example/lazyload-example.module#LazyloadExampleModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
