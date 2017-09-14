# Laravel - Angular Integration  

This project provides tools and shows you an easy way to integrate one or more Angular apps into your Laravel project.  

Depending on your preferences you can build Angular applications using **angular-cli** tool (preferred way) or without it.

**angular-cli** uses Webpack for bundling final app while Angular apps who don't use it rely on SystemJS for loading configuration, therefore integration in Laravel is different for those two development choices.  

This project supports both so if for some reason you want to have Angular apps built with **angular-cli** and packed with Webpack alongside with Angular apps which are not packed, you can.

I recomend using **angular-cli** though as apps it produces are much faster.

## Getting Started  

After you clone the code you have to build the apps by running necessary commands, than you can test from the default Laravel welcome page.  
You will see links that will take you to separate integrated Angular apps.  

First two links (Angular App 1, Angular App 2) will take you to the two Angular applications made without **angular-cli** and which are not bundled.  

Two other links will take you to separate Angular bundled apps made using **angular-cli**.  

### Setting Up  

Clone code, **cd**  to project directory and use composer to install all the dependencies.  

```
cd <your_project_dir>
composer install
```

Than install JavaScript dependencies with **npm**.  

```
npm install
```

### Structure of This Document  

Note that you must run neccessary commands to start the apps and since integration into Laravel is different whether you using **angular-cli** or not this tutorial is separated into two parts.  
If you only care for developing with **angular-cli** read first part, but if you want to run demo apps and develop in Angular not using **angular-cli** read second part also.  

+ [Angular with angular-cli integration](docs/angular-cli/Ng-cli.md)
+ [Only Angular](docs/no-cli/Ng-no-cli.md)

## License  

MIT  
