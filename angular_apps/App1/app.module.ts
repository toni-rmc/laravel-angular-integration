import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';

/* App Root */
import { AppComponent }         from './app.component';

import { MotivationComponent }  from './motivations/startAppMotivation.component';
import { TestRoutingComponent } from './test-routing.component';

/* Routing Module */
import { AppRoutingModule }     from './app-routing.module';

@NgModule({
  imports:      [
    BrowserModule,
    AppRoutingModule
  ],

  declarations: [ AppComponent, MotivationComponent, TestRoutingComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {}
