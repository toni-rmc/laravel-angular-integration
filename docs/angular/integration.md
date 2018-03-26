## Integrating Angular Applications into Laravel  

This document details how you integrate Angular applications built with **angular-cli** into Laravel.  

All of the Angular apps you bild go into `angular` directory in your Laravel project root folder.  

In `angular` folder there are two demo apps, `app1` and `app2`.  
Directory `webpack_config` is place where Webpack config files are stored.  
There are two versions of `webpack.config.js` file, one for bundling app for development found in `angular/webpack_config/dev` and one for production found in `angular/webpack_config/prod`.  

Change current working directory to the Angular application you want to work on e.g.  

```
cd ./angular/app1
```

Run `npm install` and than you develop Angular app with **angular-cli** just as you do normally without thinking of any integration.  
You use `ng g module`, `ng serve`, `ng build`, etc...  

After you run and test Angular app as a standalone you can easily integrate it into Laravel by following steps below.  

## Integration Steps  

First create route in `routes/web.php` which will lead to the app.  
Route should look like this:  

```php
Route::get('your/ngpath/{path?}', function () {
    return view('app1');
})->where('path', '.*')
  ->name('ng_app1');
```

Follow the convention and let the name of the view file be the same as the root folder of your Angular app e.g. `app1`, you can change that later if you want.  
Do not create view file just define route for now.  

Next in `angular/app1/src/laravel-ng-template.html` put all the code you want your entry page to have.  

**`angular/app1/src/laravel-ng-template.html`**  

```html
<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
  <title>Angular App One</title>
  <base href="{{ route('ng_app1', [], false) }}/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="/app1/favicon.ico">
  </head>

  <body>
  <app-root></app-root>
  </body>
</html>
```

`<base href="{{ route('ng_app1', [], false) }}/">` - this line dynamically sets proper base URL using route name. This allows for later changes of route path in `routes/web.php` without the need to edit anything else.  

Application will be in `public` directory so to reference any files in the template like `favicon.ico` precede it with app folder name beginning with `/` e.g. `/app1/favicon.ico`.

`<app-root></app-root>` - root selector of your Angular app, you can change it if you are using some other name.  

You can put Laravel blade code and even PHP code in this file if you need to.  

After that from your Angular app root directory (`angular/app1` in this case) run:

```
npm run build
```

This command will pack app into bundles and deploy it into Laravel `public` directory.  
It will also create blade view in `resources/views` based on your Angular root folder name, in this case `app1.blade.php` file will be created.  

Generated blade file will have all of your code you have put in `angular/app1/src/laravel-ng-template.html` plus all of the needed includes of bundled files in `<script>` and `<link>` tags.  

Start the server and test the aplication.  

## Packing for **dev** and **prod**  

There are two versions of `webpack.config.js` file, one for development bundling and one for production bundling.  
Development version is located in `angular/webpack_config/dev` and production version in `angular/webpack_config/prod`.  
`webpack.config.js` has to be copied in Angular app root folder, `angular/app1` in this example.  

Depending on do you want to pack for development or production copy/paste `webpack.config.js` file from one of these locations to Angular app root folder and run:  


```
npm run build
```

Every time you run this command fresh version of `resources/views/<app_root_folder_name>.blade.php` will be created, in this case `resources/views/app1.blade.php` and old distribution in `public` folder will be deleted (if exists) and replaced with new distributed program.  

All left to do is create a link to enter into Angular application.  
Pick a place and using route name create a link

```
<a href="{{ route('ng_app1') }}">Angular app link</a>
```

Of course change `route('ng_app1')` to match your route name defined in `routes/web.php`  

## Making More Angular Apps  

By default this project has two demo apps in the `angular` directory, `app1` and `app2`.  

What if you need more or you just want a new app with more meaningful name, like `store` or `dashboard` instead of `app1`?

If that is the case follow the link below.  

+ [Make another Angular app](./another_app.md)
