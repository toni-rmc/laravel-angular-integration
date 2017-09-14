<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Angular App 2 Example</title>
    <base href="{{ route('app2', [], false) }}/" />

    <link rel="stylesheet" href="/css/styles.css" />

     <!-- Polyfills -->
    <script src="/Ng/core-js/client/shim.min.js"></script>
    <script src="/Ng/zone.js/dist/zone.js"></script>
    <script src="/Ng/systemjs/dist/system.src.js"></script>
    <script src="/config/app2.config.js"></script>
    <script>
      System.import('/main.App2.js').catch(function(err){ console.error(err); });
    </script>
  </head>

  <body>
    <app2>Loading...</app2>
  </body>
</html>
