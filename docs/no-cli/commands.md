## Listing and Explaining Commands  

Before you run commands make sure you **cd** to your Laravel project root directory.  

* **`npm run ng-init`** - creates `Ng` directory in `public` and initializes Angular in it.  
Also if you use **npm install** or **npm update** to update to a new version of Angular you can use this command to push new version of Angular to `public/Ng` directory.  
In that case you don't have to delete `public/Ng` directory, running this command will reinstall all files and add new ones, if any.  

* **`npm run ng-compile`** - distributes your HTML, JS, CSS files, also compiles TS files to JavaScript, SCSS/SASS files to CSS and distributes them also.  

* **`npm run ng-compile-prod`** - same as the above but produces minified HTML and CSS files, also compiled files, TS to JS and SCSS/SASS to CSS are minified.  
Note that original JS files in your `angular_apps` directory (the ones that were not TS) will not be minified by this command. That is because I can't find decent,stable and reliable Gulp plugin that supports minifing ES6, if you know of one let me know.  

* **`npm run ng-bootstrap`** - this command is combination of `npm run ng-init`, `npm run ng-add-3rd-party` and `npm run ng-compile`, it installs Angular, installs 3rd party libraries and compiles your apps in one go.  
It is useful when you join existing project. Whith just this command you can build working application on your machine and start working on it.  

* **`npm run ng-watch`** - starts watch mode, starts browser and puts your browser in sync, actually all the browsers tabs that have wached URL open.  
When you change, add, move, delete or rename HTML, JS, CSS, SCSS, SASS and TS files in `angular_apps` it will distribute them in real time to `public`. TS files will be compiled to JS first and SCSS/SASS files to CSS than distributed.  
After each change your browser(s) wached URL tabs will be reloaded.  
Note that this command is proxying your server so before you use it start your development server e.g. `php artisan serve`.  
You can delete entire folders with files in it in build directory (`angular_apps`) and corresponding files in that folder in distribution (`public`) directory will be deleted but not the folder itself.  
Also if you delete empty directory in `angular_apps` watching could be terminated with **EPERM** error.  
So to clean empty directories from `angular_apps` and `public` directories after working in watch mode you have `npm run ng-remove-empty-dirs` command.  

* **`npm run ng-watch-nosync`** - same as the above except it will not start nor sync your browser(s). So there is no need to start development server first.  
Use it when you want to work in a watch mode but without browser synchronization.  

* **`npm run ng-publish-templates`** - this command will publish your HTML, JS, CSS files and compile SCSS/SASS to CSS without minifying them.  
It will not compile nor publish TS files.  

* **`npm run ng-clean`** - opposite of `npm run ng-compile`.  
Cleans up `public` directory.  
Does not touch `angular_apps` directory.  
It cleans JS, HTML and CSS in your distribution (`public`) directory.  
Does not delete `public/Ng` Angular directory.  
Safe to use as it will not delete anything that hasn't come from, and still is in, build (`angular_apps`) directory.  
So if you have, for example, two files in `public/somedir`:  

    1. `public/somedir/apples.js` - *which let's say is published from `angular_apps`, could be compiled from `angular_apps/somedir/apples.ts`.*  

    2. `public/somedir/oranges.js` - *which is not related to your Angular build and therefore it does not exists in `angular_apps/somedir`.*  

  First file `public/somedir/apples.js` would be deleted, second one `public/somedir/oranges.js` would be left.  
  Empty directories in distribution (`public`) directory and all nested empty directories will also be deleted if there is any.  

* **`npm run ng-add-3rd-party`** - sometimes you have to use third-party libraries in your project. `npm run ng-init` initializes Angular and other standard libraries like `rxjs` but what if you need other libraries as well in your project?  
Best way to explain is by example, so let's say you want to use a third-party library in your project e.g. **angular2-multiselect-dropdown**.  
First install it of course using `npm install angular2-multiselect-dropdown --save`.  
Than open `resources/assets/js/ng-vendor.js` and add library name to the return array of the `vendor_libraries` callback  

  ```JavaScript
  exports.vendor_libraries = function() {
      return [
               'angular2-multiselect-dropdown',
             ];
  }
  ```

    After that run this command `npm run ng-add-3rd-party`.  
Next step is to tell SystemJS where from to load new library. Open `angular_apps/config/<app_name>.config.js` and as a last entry in `map` object add this mapping:  

  ```JavaScript
  map: {
      ...
      // other libraries
      ...
      'angular2-multiselect-dropdown/angular2-multiselect-dropdown': 'npm:angular2-multiselect-dropdown/angular2-multiselect-dropdown.umd.js'
  },
  ```

    Last step is to run `npm run ng-compile`.  
Than you can use external library in your application.  
File `ng-vendor.js` is located outside of the Angular build directory (`angular_apps`), because it does not need to be published to distribution directory (`public`).  

* **`npm run ng-delete-3rd-party`** - opposite of `npm run ng-add-3rd-party`. It will only remove 3rd party libraries from `public/Ng`, it does not remove them from `node_modules`.  

* **`npm run ng-remove-empty-dirs`** - removes empty directories and all empty sub-directories from both buld (`angular_apps`) directory and distribution (`public`) directory.  
Unlike `npm run ng-clean`, it does touch `angular_apps` directory and only removes empty directories, thats all it does.  
You can pass `--build` switch to only remove empty directories and sub-directories from `angular_apps` directory or `--dist` switch to remove them only from `public` directory.  

  ```JavaScript
  // Only from the build (angular_apps) directory
  npm run ng-remove-empty-dirs -- --build
  
  // Only from the distribution (public) directory
  npm run ng-remove-empty-dirs -- --dist
  ```

  This command might come handy if you have some empty directories in `public` and/or `angular_apps` after deleting files while working in the watch mode.  

**More about `npm run ng-watch`**  
If you use `127.0.0.1:8000` as your host:port when you start your development server, you can use this command as is.  
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
