## Making Another Angular App 

For this example name of the new Angular app will be `StockManagement`.  

First **cd** to `angular` directory and run  

```
ng new StockManagement
cd StockManagement
```

Than run  

```
ng eject
```

This command will generate `webpack.config.js` file in `StockManagement`.  
Delete it, other config files will be used.

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

You will need `clean-webpack-plugin` for production bundling so install that as well

```
npm install clean-webpack-plugin --save-dev
```

Copy three config files `angular/webpack_config/base/base.config.js`, `angular/webpack_config/dev/dev.config.js` and `angular/webpack_config/prod/prod.config.js` to your app root, e.g. `angular/StockManagement`.  

That's it start making your app using all the benefits of **angular-cli** tool, build it, test it with `ng serve` and so on.  

When you are ready to integrate it into Laravel make a route to it in `routes/web.php`, something like this:

```php
Route::get('stock/handling/{path?}', function () {
    return view('StockManagement');
})->where('path', '.*')
  ->name('stock_manage');
```

Do not create view file as it will be generated from the template but let the name of view be the same as the application name, in this case `StockManagement`.  

Next create template file called `laravel-ng-template.html` in `angular/StockManagement/src`.  

Here is some minimal setup but you can add more `html`, `php` and/or Laravel blade syntax in this file.  

**`angular/StockManagement/src/laravel-ng-template.html`**  

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

## Packaging  

To package for development use `npm run build`.  
This will produce bundle suitable for the development i.e. files are not minified, source map files are generated etc...  

For the production packing use `npm run build-prod`.  
This will produce bundle suitable for the production i.e. files are minified, no source map files, license generated, hashing is used in generated bundles names etc...  

After running one of these commands there will be a new folder `StockManagement` in `public` and a new blade file `StockManagement.blade.php` in `resources/views`.  
Generated blade file will have all the necessary links to generated bundles.  

## Entering Into Angular App

Make a link somewhere on your site to enter in your new app.  
I have used `stock_manage` as a route name so in this case link would be  

```php
<a href="{{ route('stock_manage') }}">Stock</a>
```

Than you can continue to develop your app as a standalone using `ng` tool. You can start it in the browser as a standalone using `ng serve` on `http://localhost:4200/` and at the same time you can serve entire Laravel application on other port e.g. `http://localhost:8000/` with `php artisan serve`.  
Once you are ready to deploy new changes into Laravel run `npm run build` for `dev` packaging or `npm run build-prod` for `prod` packaging.  

Every time you run one of these build commands `StockManagement` app in Laravel `public` directory will be re-created and also view file `resources/views/StockManagement.blade.php` will be re-created as well.  
