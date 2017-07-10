import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode }         from '@angular/core';

import { environment }            from './environments/App1.environment.js';
import { AppModule }              from './App1/app.module';

if (environment.production)
{
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
