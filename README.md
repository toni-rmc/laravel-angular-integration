# Laravel - Angular Integration  

This project provides tools and shows you an easy way to integrate one or more Angular apps into your Laravel project.  

## Getting Started  

After you clone the code you have to build the apps by running necessary commands, than you can test from the default Laravel welcome page.  
You will see links that will take you to the separate integrated Angular apps.    

Two links will take you to the separate Angular bundled apps made using **angular-cli**.  

All Angular apps live in `angular` directory in Laravel project root directory and they are bundled and distributed to `public` directory after build.  

## Setting Up  

Clone code, **cd**  to project directory and use composer to install all the dependencies.  

```
cd <your_project_dir>
composer install
npm install
```

Follow the link below to get detailed explanation on how to integrate Angular programs into Laravel environment.

+ [Laravel - Angular integration](docs/angular/integration.md)

## Note  

This project no longer supports SistemJS build as it is outdated by now. Developing Angular projects without using **angular-cli** tool doesn't make much sense that is why this project now only focuses on integrating Angular programs made with **angular-cli** into Laravel.

## License  

MIT  
