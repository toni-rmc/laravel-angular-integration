import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestRoutingComponent } from './test-routing.component';

export const routes: Routes = [
  { path: 'eager/load', component: TestRoutingComponent},
  { path: 'lazy/load', loadChildren: 'app/lazyload_route/lazyload.module#LazyloadModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
