## Integrating Your Own Angular App  

This document details how you integrate your own Angular app from start to finish:  

> Directory in which this new app will be is gonna be called `NewApp`, in production you should use more descriptive name of what your app does e.g. `Store` or `StockManagement`. That way if you have more Angular applications you can see right away what each one is designated to do soon as you look into `angular_apps` directory.  

If you already haven't done so trough composer or manually, run these commands.  

```
npm install
npm run ng-init
```

Make Laravel route in `routes/web.php` which points to the base of our new Angular app.  
Define routes like this.  

```php
Route::get('mynew/ngapp/{path?}', function () {
    return view('newNgApp');
})->where('path', '.*')
  ->name('ng_newapp');
```

Avoid giving names to routes that start with **ng** or any variation with caps lock on e.g. **NG**, it might confuse web servers because there is a directory with the name **Ng** in Laravel `public` directory.  
Otherwise you can have whichever route you like but make sure it has `/{path?}` at the end and also `->where('path', '.*')` part.  
Optional parameter at the end of the route in combination with regex globbing pattern in `where()` method makes sure that Laravel does not get in the way when routes are meant to be passed trough and processed by Angular router.  
In this example I'm using named route, `->name('ng_newapp')`.  
You don't have to give name to the route but I strongly encourage you to do so because it allows you to later change route without the need to modify other files, most notably `<base href>` part in blade file.  

Name of the view is `newNgApp` so next step is to make new blade view **`newNgApp.blade.php`** in `resources/views`.  

File has to have all the necessary setup and Angular selector. I have used `my-app` as selector, you will use something more meaningful for your real project.  

**`newNgApp.blade.php`**  

```html
<!DOCTYPE html>
<html>
  <head>
    <base href="{{ route('ng_newapp', [], false) }}/" />
    <title>My New Angular App</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/css/styles.css" />

     <!-- Polyfills -->
    <script src="/Ng/core-js/client/shim.min.js"></script>
    <script src="/Ng/zone.js/dist/zone.js"></script>
    <script src="/Ng/systemjs/dist/system.src.js"></script>
    <script src="/config/mynewapp.config.js"></script>
    <script>
      System.import('/main.mynewapp.js').catch(function(err){ console.error(err); });
    </script>
  </head>

  <body>
    <my-app>Loading...</my-app>
  </body>
</html>
```

Notice that all paths start with **`/`** and pay attention to

```html
<base href="{{ route('ng_newapp', [], false) }}/" />
```

line.  
You could hard code Laravel route in the base tag instead, e.g. `<base href="/mynew/ngapp/" />` but using named routes and Laravel's `route()` helper function you don't have to edit this line if you later decide to change the base route.  

Put this route link somewhere on your site as an entry point to your new Angular app, lets say in the default welcome blade.  

```html
<div><a href="{{ route('ng_newapp') }}">My New Angular App</a></div>
```

Notice the references to the config file `/config/mynewapp.config.js` and bootstrap file `/main.mynewapp.js` in the **`newNgApp.blade.php`**.  
So next step is to create those files.  

**`mynewapp.config.js`**:  
Create a file with this name in the `angular_apps/config` directory and just copy/paste all of the content from `angular_apps/config/app1.config.js` into it.  
Change only line **#14** to point to the directory where your new Angular app will be. Lets say our new app will be in the `angular_apps/NewApp` directory.  
So in **`angular_apps/config/mynewapp.config.js`** after you copy/paste, change this:  

```JavaScript
    map: {
      // our app is within the App1 folder
      'app': '/App1',
      ...
      }
```

to this:  

```JavaScript
    map: {
      // our app is within the NewApp folder
      'app': '/NewApp',
      ...
      }
```

Value should begin with a slash like the example above.  
That's it for the config file.  

Next file to create is **`main.mynewapp.js`**.  
This file will be compiled by TypeScript transpiler.  
So you will actually create file with .ts extension.  
In `angular_apps` create new file **`main.mynewapp.ts`** (notice **.ts** at the end).  
This is the bootstrap file and in it, you point Angular at the entry point, that is, root module of your application.  
Content of this file would be this:  

**`main.mynewapp.ts`**  

```JavaScript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode }         from '@angular/core';

import { environment }            from './environments/newApp.environment.js';
import { AppModule }              from './NewApp/app.module';

if (environment.production)
{
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
```

Two lines to pay attention to (and change according to your needs) are:  

```JavaScript
import { environment } from './environments/newApp.environment.js';
```

You can see that it points to the `environments` folder and to file `newApp.environment.js`. We will be creating this file next.  

Second line  

```JavaScript
import { AppModule } from './NewApp/app.module';
```

points to the `NewApp` folder to `app.module.js` where root module `AppModule` is defined. We will be creating all of this too below.  

But first, let's create the enviroments file. This file will be in your `angular_apps/environments` directory and it will be transpiled to JS so it will be TypeScript file with **`.ts`** extension:  

**`newApp.environment.ts`**  

```JavaScript
export const environment = {
  production: false
};
```

Set `production: true` when your new Angular app is ready to run in the production environment.  

That concludes the setup and now you actually create your new Angular app.  

Create new folder in `angular_apps` where your new application will live.  
For this example create folder with the name `NewApp`.  

And thats it. In the `NewApp` folder you create your new Angular app.  
To conclude this instructions, lets create very simple Angular app with root module and one component.  
In the `angular_apps/NewApp` create file called `app.module.ts`  

**`app.module.ts`**  

```JavaScript
import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';

/* App Root */
import { AppComponent }       from './app.component';

@NgModule({
  imports:      [
    BrowserModule
  ],

  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule {}
```

Change this file as you develop your application. Note the reference to the `./app.component`.  

Lets make this one as well. In `angular_apps/NewApp` create file called `app.component.ts`.  

**`app.component.ts`**  

```JavaScript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
     Hello <span class="ng">Angular</span> from <span class="L">Laravel</span>.
    <div>Your new Angular app is here.</div>
  `
})
export class AppComponent {}
```

Pay attention to  

```JavaScript
selector: 'my-app',
```

line. Remember this is the "root selector" for this app which we had put in the `newNgApp.blade.php`.  

Now compile and distribute all of the changes in the build `angular_apps` directory to distribution `public` directory.  
To do that, from your Laravel root project directory (**not** angular_apps) run command:  

```JavaScript
npm run ng-compile
```

Go to the default welcome page and test your new Angular app by clicking the link to it.  

Before doing all of this you could start web server and run watch command:  

```JavaScript
npm run ng-watch
```

or without starting web server  

```JavaScript
npm run ng-watch-nosync
```

As soon as you finish making all the necessary files and/or changes your app would be ready to use without the need to run compile command manually.  
