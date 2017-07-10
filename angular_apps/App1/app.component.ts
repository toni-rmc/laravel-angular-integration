import { Component } from '@angular/core';

@Component({
  selector: 'app1',
  template: `
      Hello <span class="ng">Angular</span> from <span class="L">Laravel</span>, looks like it works...
      <p><mm></mm></p>
      <ul>
        <li><a routerLink="/eager/load" routerLinkActive="active">Click to test eagerly loaded route</a></li>
        <li><a routerLink="/lazy/load" routerLinkActive="active">Click to test lazy loaded route</a></li>
      </ul>
      <router-outlet></router-outlet>
  `
})
export class AppComponent {}
