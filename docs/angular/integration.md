## Integrating Angular Applications into Laravel  

This document details how you integrate Angular applications built with **angular-cli** into Laravel.  

All of the Angular apps you build go into `angular` directory in your Laravel project root folder.  

In `angular` folder there are two demo apps, `app1` and `app2`.   
Change current working directory to the Angular application you want to work on e.g.  

```
cd ./angular/app1
```

Run `npm install` and than you develop Angular app with **angular-cli** just as you do normally without thinking of any integration.  
You use `ng g module`, `ng serve`, `ng build`, etc...  

After you run and test Angular app as a standalone you can easily integrate it into Laravel by following steps below.  

## Integration Steps  

**Note:** For the two demo Angular apps that come with this project, `angular/app1` and `angular/app2` integration steps below are already made.  

First create a route in `routes/web.php` which will lead to the app.  
Route should look like this:  

```php
Route::get('your/ngpath/{path?}', function () {
    return view('app1');
})->where('path', '.*')
  ->name('ng_app1');
```

Follow the convention and let the name of the view file be the same as the root folder of your Angular app e.g. `app1`, you can change that later if you want.  
Do not create view file just define route.  

Next in the `angular/app1/src/laravel-ng-template.html` put all the code you want your entry page to have.  

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

+ `<base href="{{ route('ng_app1', [], false) }}/">` - this line dynamically sets proper base URL using route name. This allows for later changes of route path in the `routes/web.php` without the need to edit anything else.  

+ Application will be in `public` directory so to reference any files in the template like `favicon.ico` precede it with app folder name beginning with `/` e.g. `/app1/favicon.ico`.  
Don't reference external `.js`, `.css` files and assets directly in the template, instead point to them in `.angular-cli.json` file in `apps[].scripts`, `apps[].styles` and `apps[].assets` sections respectively, this way they will be bundled.  

+ `<app-root></app-root>` - root selector of your Angular app, you can change it if you are using some other name.  

You can put Laravel blade code and even PHP code in this file if you need to.  

## Bundling for `dev` or `prod`

From your Angular app root directory (`angular/app1` in this case) for the `development` build run  

```
npm run build
```

and for the `production` build run  

```
npm run build-prod
```

Both these commands will pack app suitable for `dev` or `prod` bundles and deploy it into Laravel `public` directory.  
Blade view in `resources/views` will be created based on your Angular app root folder name, in this case `app1.blade.php` file will be created.  

Generated blade file will have all of your code you have put in `angular/app1/src/laravel-ng-template.html` plus all of the needed includes of generated bundled files in `<script>` and `<link>` tags.  
When bundling for `prod` is used it will be minified.  

Construct a link to enter into Angular application.  
Pick a place and using route name create a link, in this case route name is `ng_app1`.  

```
<a href="{{ route('ng_app1') }}">Angular App 1</a>
```  

## Making More Angular Apps  

By default this project has two demo apps in the `angular` directory, `app1` and `app2`.  

What if you need more or you just want a new app with more meaningful name, like `store` or `dashboard` instead of `app1`?

If that is the case follow the link below.  

+ [Make another Angular app](./another_app.md)
