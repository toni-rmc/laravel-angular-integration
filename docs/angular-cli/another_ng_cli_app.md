## Make Brand New Ng App 

For this example name of the new Ng app will be `StockManagement`.  

First **cd** to `angular_apps_cli` and run:  

```
ng new StockManagement
cd StockManagement
```

Than run:  

```
ng eject
```

This commant will generate `webpack.config.js` file in `StockManagement`.  
Delete it, other one will be used later.

Open `.angular-cli.json` and change `ejected` value from `true` to `false`  

```
  "project": {
    "name": "StockManagement",
    "ejected": false
  },
```

Install new packages with

```
npm install
```

You will need `clean-webpack-plugin` for production bundling so install that as well:

```
npm install clean-webpack-plugin --save-dev
```

That's it start making your app using all the benefits of **angular-cli** tool, bulid it, test it with `ng serve` and so on.  

When you are ready to integrate it into Laravel make a route to it in `routes/web.php`, something like this:

```php
Route::get('stock/handling/{path?}', function () {
    return view('StockManagement');
})->where('path', '.*')
  ->name('stock_manage');
```

Do not create view file as it will be generated from the template but let the name of view be the same as the application name, in this case `StockManagement`.  

Next create template file called `laravel-ng-template.html` in `angular-apps_cli/StockManagement/src`.  

Here is some minimal setup but you can add more `html`, `php` and/or Laravel blade syntax in this file.  

**`angular_apps_cli/StockManagement/src/laravel-ng-template.html`**  

```html
<!DOCTYPE html>
<html>
  <head>
  <meta charset="utf-8">
  <title>Stock Management</title>
  <base href="{{ route('stock_manage', [], false) }}/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>

  <body>
  <app-root></app-root>
  </body>
</html>
```

After that decide do you want to integrate and bundle for development or for production.  
Choose `webpack.config.js` from `angular_apps_cli/webpack_config/dev` for development bundle and one from `angular_apps_cli/webpack_config/prod` for production bundle.

Copy/paste it in your app root in this case `StockManagement` and run:

```
npm run build
```

You will see new folder `StockManagement` in `public` and new blade file `StockManagement.blade.php` in `resources/views`.  
Generated blade file will have all the neccesary bundles included.  

Make a link somwhere on your site to enter in your new app.  
I have used `stock_manage` as a route name so in this case link would be:

```php
<a href="{{ route('stock_manage') }}">Stock</a>
```

After that you can continue to develop your app as a standalone using `ng` tool. You can start it in the browser as a standalone using `ng serve` on `http://localhost:4200/` and at the same time you can serve entire Laravel application on other port e.g. `http://localhost:8000/` with `php artisan serve`.  
Once you are ready to deploy new changes into Laravel just run

```
npm run build
```

again.  

Also when your app is ready for production copy/paste `webpack.config.js` from `angular_apps_cli/webpack_config/prod` into application root, in this case `angular_apps_cli/StockManagement` replacing the development `webpack.config.js`, and run the same command again.  This will delete and re-create `StockManagement` in `public` but this time it will be bundled for production use, and also view file `resources/views/StockManagement.blade.php` will be re-created, minified and all the necessary bundles included.  
