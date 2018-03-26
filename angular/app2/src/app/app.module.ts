import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestRoutingComponent } from './app-routing/test-routing/test-routing.component';
import { MotivationsComponent } from './motivations/motivations.component';

/* Routing Module */
import { AppRoutingModule }     from './app-routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TestRoutingComponent,
    MotivationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
