/*
 |--------------------------------------------------------------------------
 | External Angular Libraries
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your external Angular libraries.
 |
 | Follow these steps to get your external library working:
 |
 | - install library with "npm install <package_name> --save"
 | - put library name in the array bellow
 | - run "npm run ng-add-3rd-party" command
 |
 | After steps above tell SystemJS where from to load new library.
 | Open "angular_apps/config/<app_name>.config.js" and add new mapping at the end of the "map" property object.
 | For example entry for 'angular2-multiselect-dropdown' library would be:
 |
 | map :{
 |   ...
 |   'angular2-multiselect-dropdown/angular2-multiselect-dropdown': 'npm:angular2-multiselect-dropdown/angular2-multiselect-dropdown.umd.js'
 | },
 |
 | than run "npm run ng-compile" command.
 | Now you can use external library in your Angular app.
 */

exports.vendor_libraries = function() {
  return [
          // Add names of the 3rd party packages here that you want your Angular app to have access to.
          // If for example you have used "npm install angular2-multiselect-dropdown --save" command, add the
          // package name in this array like in the example bellow.

           // 'angular2-multiselect-dropdown',

         ];
}
