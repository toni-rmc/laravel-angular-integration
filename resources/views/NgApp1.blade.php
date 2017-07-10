<!DOCTYPE html>
<html>
  <head>
    <base href="{{ route('app1', [], false) }}/" />
    <title>Angular App 1 Example</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/css/styles.css" />

     <!-- Polyfills -->
    <script src="/Ng/core-js/client/shim.min.js"></script>
    <script src="/Ng/zone.js/dist/zone.js"></script>
    <script src="/Ng/systemjs/dist/system.src.js"></script>
    <script src="/config/app1.config.js"></script>
    <script>
      System.import('/main.App1.js').catch(function(err){ console.error(err); });
    </script>
  </head>

  <body>
    <app1>Loading...</app1>
  </body>
</html>
