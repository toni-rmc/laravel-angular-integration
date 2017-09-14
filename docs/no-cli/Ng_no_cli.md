# Angular Integration to Laravel Not Using **angular-cli**

This project provides tools and shows you an easy way to integrate one or more Angular apps into your Laravel project. 
This document describes integrating Angular applications built **without** angular-cli.  
 
There are two Angular demo apps made without **angular-cli**.  

### Installing  

Initialize Angular and compile and publish code with these two commands.  

```
npm run ng-init
npm run ng-compile
```

Start development web server.  

```
php artisan serve
```

Go to your `localhost:8000` welcome page and click the links to enter into two Angular demo apps.  

## Where Do Angular Apps Live?  

All of your Angular apps which are not built using **angular-cli** are located in the `angular_apps` directory in your Laravel project root directory.  

This is where you develop in TypeScript, JavaScript, HTML, CSS, SCSS, SASS and you will use  **npm** commands to compile and distribute code into `public`.  

This system supports browsers synchronization so you can watch changes in your browsers as you save them.  
Keep reading it will be explained bellow how do you start browsers sync in the [Listing and Explaining Commands](#listing-and-explaining-commands) section.  

Laravel `public` directory is distribution directory and you don't code in it directly.  
You code your apps in `angular_apps` directory and use build tools provided to publish HTML, JS, CSS files to `public` directory, and to compile TS files to JS, SCSS/SASS files to CSS and publish them to `public` directory as well.  

## Structure of the `angular_apps` Directory  

These two simple demo Angular programs can be clear guide how do you integrate your own apps.  
I will detail how do you integrate your own app in the [Integrating Your Own Angular App](#integrating-your-own-angular-app) section.  

In this folder you will have two completely separatate indenpendent Angular applications App1 and App2.  
All of the code specific to them is in their own directories:  
 + App1
 + App2

Next we have:  
+ config
+ environments

**config** holds configuration JS files for each app. In this demo, `app1.config.js` and `app2.config.js`.  

Only thing they differ is line #14:  

**'app': '/App1',**  
**'app': '/App2',**  

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

After you run `npm run ng-init` and `npm run ng-compile` you will notice some new files and directories in your `public` directory.  

* App1
* App2
* config
* environments
* Ng
* main.app1.js
* main.app2.js
* systemjs-angular-loader.js

Basically all of your HTML, CSS, JS and compiled TS and SCSS/SASS files from `angular_apps` are distributed to `public` with the addition of **`Ng`** directory, which is the place where Angular and friends live.  

## Commands and Instructions  

Follow links below to see what commands are available for managing your project and to see detailed instructions on how to integrate your own new Angular app.  

+ [List of available commands](./commands.md)
+ [Integrating your own new Angular app](./integrating_new_app.md)
