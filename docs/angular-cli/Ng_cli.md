## Integrating Angular Applications Built With **angular-cli**  

This document details how you integrate Angular applications built with **angular-cli** into Laravel.  

All of the Angular apps you bild with **angular-cli** go into `angular_apps_cli` directory.  

In `angular_apps_cli` there are two demo apps, `ng-cli-app1` and `ng-cli-app2`.  
Directory `webpack_config` is place where Webpack config files are stored.  
There are two versions of `webpack.config.js` file, one for bundling app for development found in `webpack_config/dev` and one for production found in `webpack_config/prod`.  

Change current working directory to the Ng application you want to work on e.g.  

```
cd ./angular_apps_cli/ng-app-app1
```

Run `npm install` and than you develop Angular app with **angular-cli** just as you do normally without thinking of any integration.  
You use `ng g module`, `ng serve`, `ng build`, etc...  

After you run and test Angular app as a standalone you can easily integrate it into Laravel by following steps below.  

## Integration Steps  

First create route in `routes/web.php` which will lead to the app.  
Route should look like this:  

```php
Route::get('your/ngpath/{path?}', function () {
    return view('ng-cli-app1');
})->where('path', '.*')
  ->name('ng_app1');
```

Follow the convention and let the name of the view file be the same as the root folder of your Angular app e.g. `ng-cli-app1`, you can change that later if you want.  
Do not create view file just define route for now.  

Next in `angular_apps_cli/ng-cli-app1/src/laravel-ng-template.html` put all the code you want your entry page to have.  

**`angular_apps_cli/ng-cli-app1/src/laravel-ng-template.html`**  

```html
<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
  <title>NgcliApp</title>
  <base href="{{ route('ng_app1', [], false) }}/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="/ng-cli-app1/favicon.ico">
  </head>

  <body>
  <app-root></app-root>
  </body>
</html>
```

`<base href="{{ route('ng_app1', [], false) }}/">` - this line dynamically sets proper base URL using route name. This allows for later changes of route path in `routes/web.php` without the need to edit anything else.  

Application will be in `public` directory so to reference any files in the template like `favicon.ico` precede it with app folder name beginning with `/` e.g. `/ng-cli-app1/favicon.ico`.

`<app-root></app-root>` - change `app-root` to match root selector of your Ng app.  

You can put Laravel blade code and even PHP code in this file if you need to.  

After that from your Ng app root directory (`angular_apps_cli/ng-cli-app1` in this case) run:

```
npm run build
```

This command will pack app into bundles and deploy it into Laravel `public` directory.  
It will also create blade view in `resources/views` based on your Angular root folder name, in this case `ng-cli-app1.blade.php` file will be created.  

Generated blade file will have all of your code you have put in `angular_apps_cli/ng-cli-app1/src/laravel-ng-template.html` plus all of the needed includes of bundled files in `<script>` and `<link>` tags.  

Start the server and test the aplication.  

## Packing for **dev** and **prod**  

There are two versions of `webpack.config.js` file, one for development bundling and one for production bundling.  
Development version is located in `angular_apps_cli/webpack_config/dev` and production version in `angular_apps_cli/webpack_config/prod`.  
`webpack.config.js` has to be in Angular app root folder, `ng-cli-app1` in this example.  

Depending on do you want to pack for development or production copy/paste `webpack.config.js` file from one of these locations to Angular app root folder and run:  


```
npm run build
```

Every time you run this command fresh version of `resources/views/<app_root_folder_name>.blade.php` will be created, in this case `resources/views/ng-cli-app1.blade.php`.  

All left to do is create a link to enter into Angular application.  
Pick a place and using route name create a link

```
<a href="{{ route('ng_app1') }}">Angular app link</a>
```

Of course change `route('ng_app1')` to match your route name defined in `routes/web.php`  

## Making More Angular Apps  

By default this example has two demo apps built with **angular-cli** in the `angular_apps_cli` directory, `ng-cli-app1` and `ng-cli-app2`.  

What if you need more or you just want a new app with more meaningful name, like `store` or `dashboard` instead of `ng-cli-app1`?

If that is the case follow the link below.  

+ [Make another Angular app](./another_ng_cli_app.md)
