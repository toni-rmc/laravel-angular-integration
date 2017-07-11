# Laravel - Angular Integration  

This project provides tools and shows you an easy way to integrate one or more Angular apps into your Laravel project.  
You can clone code from here and start integrating or you can do it [without cloning](#set-up-angular-in-existing-laravel-project) code from here if you have existing project or future versions of Laravel have different file stucture.  

### Prerequisites  

* [PHP](http://www.php.net/downloads.php) - if you are on Windows use this link [PHP](http://windows.php.net/download)
* [Composer](https://getcomposer.org/doc/00-intro.md)
* [Node.js](https://nodejs.org/en/download/)
* **npm** - *you will get npm with Node.js installation*
* **Database** - *of your choice, although you don't need it for these examples alone*

## Getting Started  

After you clone and install code you can test right away from default Laravel welcome page.  
Example has two Angular demo apps to which you can go by clicking the links **App 1** and **App 2** on the home welcome page.  

### Installing  

Once you have the code, you can set up a database connection just like with any other Laravel project but for this examples alone you don't have to. **cd**  to your project directory and use composer to install all the dependencies.  

```
cd <your_project_dir>
composer install
```
composer will call `npm install` and `npm run ng-init` in the post-install script so, depending on your machine, it will take a minut or more to install Laravel dependencies, npm dependencies and to initialize Angular.  

---
**`Important!`**
Before `composer install` call this command:  

```PHP
composer config --global process-timeout 2000
```

You only have to call it once so after you run it one time, forget about it. That means for all following Laravel projects you don't have to call this command after you do it once.  
It is needed because composer will time-out and abort processes that run longer than 300 seconds and to make sure things go smoothly we increase that value to 2000.  
I strongly recommend using it since I have put `npm install` and `npm run ng-init` in *"post-install-cmd"* script of the **composer.json**.  
Dependencies installation and those two commands together can take some time to initially install so be patient.  
This command does lots of work and even if you don't see console text updating for some time it hasn't stuck, just does work in the background, so again, be patient.  
You will see some warnings, they are nothing serious and you will only do this command once. For later **composer** calls you use `composer update`.  

Alternatively you can remove `npm install` and `npm run ng-init` from the **composer.json**'s *"post-install-cmd"* script and call those commands manually right after `composer install`.  
In that case workflow would be:

```
composer install
npm install
npm run ng-init
```

---


After finishing issue these commands:  

```
npm run ng-compile
php artisan serve
```

Go to your `localhost:8000` welcome page and click the links to enter into two Angular demo apps.  

## Where Do Angular Apps Live?  

All of your Angular apps are located in the `angular_apps` directory in your Laravel project root directory.  

This is where you develop in TypeScript, JavaScript, HTML and CSS and you will use  **npm** commands to compile and distribute code into `public`.  

This system supports browsers synchronization so you can watch changes in your browsers as you save them.  
Keep reading it will be explained bellow how do you start browsers sync in the [Listing and Explaining Commands](#listing-and-explaining-commands) section.  

Laravel `public` directory is distribution directory and you don't code in it directly.  
You code your apps in `angular_apps` directory and use build tools provided to publish HTML, JS, CSS files to `public` directory, and to compile TS files to JS and publish them to `public` directory as well.  

## Structure of the `angular_apps` Directory  

These two simple demo Angular programs can be clear guide how do you integrate your own apps.  
I will detail how do you integrate your own app in the [Integrating Your Own Angular App](#integrating-your-own-angular-app) section.  

In this folder you will have two completely separatate indenpendent Angular applications (App1 and App2).  
 All of the code specific to them is in their own directories:  
 + App1
 + App2

If you want to publish JS and CSS files to `public/js` and `public/css` put them in:  
+ js
+ css

that is `angular_apps/js` and `angular_apps/css` to be clear.  

Next we have:  
+ config
+ environments

**config** holds configuration JS files for each app. In this demo, `app1.config.js` and `app2.config.js`.  

Only thing they differ is line #14:  
**'app': '/App1',** | **'app': '/App2',**  
which points to the locations where apps live.  

Last directory to mention is **environments**.  
Serves as a place to set up PROD or DEV enviroment for each app.  
Inside **environments** directory in this example you have   `App1.environment.ts` and `App2.environment.ts` files, one for each App.  
Files contain environment objects, at the moment with a single property `production: false`.  
Set this one to **true** for each app you want to run in production mode.  

Next we have some files:  
+ **systemjs-angular-loader.js** - *only one is needed and you don't have to edit it*
+ **main.App1.ts**
+ **main.App2.ts**

`main.<your-app-name>.ts` files serve as an entry point to your Angular application.  

## `public` Directory  

After you run `npm run ng-compile` you will notice some new files and directories in your `public` directory.  

* App1
* App2
* config
* environments
* Ng
* main.app1.js
* main.app2.js
* systemjs-angular-loader.js

Basically all of your HTML, CSS, JS and compiled TS files from `angular_apps` are distributed to `public` with the addition of **`Ng`** directory, which is the place where Angular lives.  

## Listing and Explaining Commands  

Before you run commands make sure you **cd** to your Laravel project root directory.  

* **`npm run ng-init`** - *if  you delete **Ng** directory you can recreate it with this command.  
Also if you use **npm** to update to a new version of Angular you can use this command to update new version to `public/Ng` directory.  
In that case you don't have to delete `public/Ng` directory, running this command will reinstall all files and add new ones, if any.*  

* **`npm run ng-compile`** - *distributes your HTML, JS, CSS files and compiles TS files to JavaScript and distributes them also.*  

* **`npm run ng-compile-prod`** - *same as the above but produces minified HTML and CSS files, also compiled JS files from the TS, are minified.  
Note that original JS files in your `angular_apps` directory (the ones that were not TS) will not be minified by this command. That is because I can't find decent,stable and reliable Gulp plugin that supports minifing ES6, if you know of one let me know.*  

* **`npm run ng-bootstrap`** - *this command is combination of `npm run ng-init` and `npm run ng-compile`, that is it installs Angular and compiles your apps in one go.*  

* **`npm run ng-watch`** - *starts watch mode, starts browser and puts your browser in sync, actually all the browsers tabs that have wached URL open.  
When you change, add, move, delete or rename HTML, JS, CSS and TS files in `angular_apps` it will distribute them in real time to `public`. TS files will be compiled to JS first than distributed.  
After each change your browser(s) wached URL tabs will be reloaded.  
Note that this command is proxying your server so before you use it start your development server e.g. `php artisan serve`.  
You can delete entire folders with files in it in build directory (`angular_apps`) and corresponding files in that folder in distribution (`public`) directory will be deleted but not the folder itself.  
Also if you delete empty directory in `angular_apps` watching could be terminated with **EPERM** error.  
So to clean empty directories from `angular_apps` and `public` directories after working in watch mode you have `npm run ng-remove-empty-dirs` command.*  

* **`npm run ng-watch-nosync`** - *same as the above except it will not start nor sync your browser(s). So there is no need to start development server first.  
Use it when you want to work in a watch mode but without browser synchronization.*  

* **`npm run ng-publish-templates`** - *this command wil only publish your HTML, JS and CSS files without minifying them. It will not compile nor publish TS files.*  

* **`npm run ng-clean`** - *opposite of `npm run ng-compile`.  
Cleans up `public` directory.  
Does not touch `angular_apps` directory.  
It cleans JS, HTML and CSS in your distribution (`public`) directory.  
Does not delete `public/Ng` Angular directory.  
Safe to use as it will not delete anything that hasn't come from, and still is in, build (`angular_apps`) directory.  
So if you have, for example, two files in `public/somedir`:*  

    1. `public/somedir/apples.js` - *which let's say is published from `angular_apps`, could be compiled from `angular_apps/somedir/apples.ts`.*  

    2. `public/somedir/oranges.js` - *which is not related to your Angular build and therefore it does not exists in `angular_apps/somedir`.*  

  *First file `public/somedir/apples.js` would be deleted, second one `public/somedir/oranges.js` would be left.  
  Empty directories in distribution (`public`) directory and all nested empty directories will also be deleted if there is any.*  

* **`npm run ng-remove-empty-dirs`** - *removes empty directories and all empty sub-directories from both buld (`angular_apps`) directory and distribution (`public`) directory.  
Unlike `npm run ng-clean`, it does touch `angular_apps` directory and only removes empty directories, thats all it does.  
You can pass `--build` switch to only remove empty directories and sub-directories from `angular_apps` directory or `--dist` switch to remove them only from `public` directory.*  

  ```JavaScript
  // Only from the build (angular_apps) directory
  npm run ng-remove-empty-dirs -- --build
  
  // Only from the distribution (public) directory
  npm run ng-remove-empty-dirs -- --dist
  ```

  *This command might come handy if you have some empty directories in `public` and/or `angular_apps` after deleting files while running `npm run ng-watch` command.*  

**More about `npm run ng-watch`**  
If you use `localhost:8000` as your host:port when you start your development server, you can use this command as is.  
This is the default host and port when you start development server like this `php artisan serve`.  
However if you have development server started using some other host and/or port you can use this command in combination with `--hp` switch.  

```JavaScript
npm run ng-watch -- --hp <your_host>:<your_port>
// Example
npm run ng-watch -- --hp localhost:80
```
 or  
 
 ```JavaScript
 npm run ng-watch -- --hp="<your_host>:<your_port>"
 // Example
 npm run ng-watch -- --hp="localhost:80"
 ```

You can also give protocol to the `hp` switch value  

```JavaScript
npm run ng-watch -- --hp="http://example.com:80"
// Or with HTTPS if you have it configured
npm run ng-watch -- --hp="https://example.com:443"
```

 After using command `npm run ng-watch`, local proxying URL will be `http://localhost:3000`.  

If you plan to use **PHP** development server on your localhost give it the IP address, not "localhost" string, otherwise proxying might not work.  
So for example, **not** ~~`php -S localhost:8080`~~, but `php -S 127.0.0.1:8080`.  

## Integrating Your Own Angular App  

Details on how you integrate your own Angular app from start to finish:  

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

**`mynewapp.config.js` :**  
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

## Set Up Angular In Existing Laravel Project  

If you already have existing Laravel project or for some reason don't want to clone the code from here you can still implement Angular easy.  

Make new folder in your Laravel root directory called `angular_apps`.  

Copy/paste following files from this project into yours.  

* `angular_apps/systemjs-angular-loader.js`
* `gulpfile.js`
* `package.json`
* `tsconfig.json`
* `tslint.json`

All of the files go into root Laravel project except `systemjs-angular-loader.js` which goes in `angular_apps` folder.  

**`package.json` note**  
If you haven't done any modifications to `package.json` in your project so far just copy/paste one from this project.  
However if you already did make modifications in it, than you don't just replace `package.json`, you will have to merge your `package.json` with `package.json` from this project.  
Resulting `package.json` should have all the **scripts**, **dependencies** and **devDependencies** in it, yours from before and the ones in this project's `package.json`.  
Make sure you don't have any duplicate **scripts**, **dependencies** or **devDependencies** after merge.  
You can do it by hand or use some tool available for that.  

After you have made `angular_apps` folder, copy/pasted or merged `package.json` and copy/pasted other files run  

```JavaScript
npm install
```

or if you already have run this command as a part of your previous workflow, run:  

```JavaScript
npm update
```

Than you can initialize Angular by running:  

```JavaScript
npm run ng-init
```

At this point you start to build your Angular app in `angular_apps` directory.  
Follow the instructions in [Integrating Your Own Angular App](#integrating-your-own-angular-app) section.  

## Disclaimer  

This document does not explain how to set up Laravel project, configure database connection and so on. It assumes you already have that knowledge.  

## License  

MIT  
