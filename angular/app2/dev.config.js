const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const postcssImports = require('postcss-import');
const CleanPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const commonConfig = require('./base.config.js');

const { SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { NamedLazyChunksWebpackPlugin, PostcssCliResources } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main"];
const hashFormat = {"chunk":"","extract":"","file":".[hash:20]","script":""};
const baseHref = "";
const deployUrl = "";
const projectRoot = process.cwd();
const maximumInlineSize = 10;

const APP_DIR = path.basename(__dirname);
const APP_PATH = path.join(__dirname, "..", "..", "public", APP_DIR);

const postcssPlugins = function (loader) {
        return [
            postcssImports({
                resolve: (url, context) => {
                    return new Promise((resolve, reject) => {
                        let hadTilde = false;
                        if (url && url.startsWith('~')) {
                            url = url.substr(1);
                            hadTilde = true;
                        }
                        loader.resolve(context, (hadTilde ? '' : './') + url, (err, result) => {
                            if (err) {
                                if (hadTilde) {
                                    reject(err);
                                    return;
                                }
                                loader.resolve(context, url, (err, result) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(result);
                                    }
                                });
                            }
                            else {
                                resolve(result);
                            }
                        });
                    });
                },
                load: (filename) => {
                    return new Promise((resolve, reject) => {
                        loader.fs.readFile(filename, (err, data) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            const content = data.toString();
                            resolve(content);
                        });
                    });
                }
            }),
            postcssUrl({
                filter: ({ url }) => url.startsWith('~'),
                url: ({ url }) => {
                    const fullPath = path.join(projectRoot, 'node_modules', url.substr(1));
                    return path.relative(loader.context, fullPath).replace(/\\/g, '/');
                }
            }),
            postcssUrl([
                {
                    // Only convert root relative URLs, which CSS-Loader won't process into require().
                    filter: ({ url }) => url.startsWith('/') && !url.startsWith('//'),
                    url: ({ url }) => {
                        if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
                            // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
                            return `${deployUrl.replace(/\/$/, '')}${url}`;
                        }
                        else if (baseHref.match(/:\/\//)) {
                            // If baseHref contains a scheme, include it as is.
                            return baseHref.replace(/\/$/, '') +
                                `/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
                        }
                        else {
                            // Join together base-href, deploy-url and the original URL.
                            // Also dedupe multiple slashes into single ones.
                            return `/${baseHref}/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
                        }
                    }
                },
                {
                    // TODO: inline .cur if not supporting IE (use browserslist to check)
                    filter: (asset) => {
                        return maximumInlineSize > 0 && !asset.hash && !asset.absolutePath.endsWith('.cur');
                    },
                    url: 'inline',
                    // NOTE: maxSize is in KB
                    maxSize: maximumInlineSize,
                    fallback: 'rebase',
                },
                { url: 'rebase' },
            ]),
            PostcssCliResources({
                deployUrl: loader.loaders[loader.loaderIndex].options.ident == 'extracted' ? '' : deployUrl,
                loader,
                filename: `[name]${hashFormat.file}.[ext]`,
            }),
            autoprefixer({ grid: true }),
        ];
    };

/*
 |--------------------------------------------------------------------------
 | Load Configuration Variables
 |--------------------------------------------------------------------------
 |
 | Load configuration variables from .angular-cli.json file.
 |
 */

let angular_cli = JSON.parse(fs.readFileSync('.angular-cli.json', 'utf8'));

let main = [];
let polyfills = [];
let assets = [];
let scripts = [];
let styles = [];

angular_cli.apps.forEach( app =>  {
    main.push("./" + path.join(app.root, app.main));
    polyfills.push("./" + path.join(app.root, app.polyfills));

    if (app.assets instanceof Array && app.assets.length > 0)
    {
        assets = assets.concat(app.assets);
    }

    let s = app.scripts;

    if (s instanceof Array && s.length > 0)
    {
        s = s.map(script => "script-loader!./" + path.join(app.root, script));
        scripts = scripts.concat(s);
    }

    let sc = app.styles;

    if (sc instanceof Array && sc.length > 0)
    {
        sc = sc.map(style => "./" + path.join(app.root, style));
        styles = styles.concat(sc);
    }

});

/*
 |--------------------------------------------------------------------------
 | Create and Set Up Entry Object
 |--------------------------------------------------------------------------
 |
 | Setup entry object and populate it with configuration variables.
 |
 */

function setEntry(entry, key, item)
{
    if (item.length > 0)
    {
        entry[key] = item;
    }
}

let entry = {};

setEntry(entry, "main", main);
setEntry(entry, "polyfills", polyfills);
setEntry(entry, "scripts", scripts);
setEntry(entry, "styles", styles);

/*
 |--------------------------------------------------------------------------
 | Define Array of External CSS files
 |--------------------------------------------------------------------------
 |
 | Make array of full paths to external CSS files to exclude them in rules
 | and include them in ExtractTextPlugin.
 |
 */

style_paths = styles.map(style => path.join(process.cwd(), style));

module.exports = merge(commonConfig, {
  "entry": entry,
  "output": {
    "path": APP_PATH,
    "publicPath": '/' + APP_DIR + '/',
    "filename": "[name].bundle.js",
    "chunkFilename": "[id].chunk.js",
    "crossOriginLoading": false
  },
  "module": {
    "rules": [
      {
        "exclude": style_paths,
        "test": /\.css$/,
        "use": [
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          }
        ]
      },
      {
        "exclude": style_paths,
        "test": /\.scss$|\.sass$/,
        "use": [
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "embedded",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": true,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "exclude": style_paths,
        "test": /\.less$/,
        "use": [
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "embedded",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": true
            }
          }
        ]
      },
      {
        "exclude": style_paths,
        "test": /\.styl$/,
        "use": [
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "embedded",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": true,
              "paths": []
            }
          }
        ]
      },
      {
        "include": style_paths,
        "test": /\.css$/,
        "use": [
          "style-loader",
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "embedded",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          }
        ]
      },
      {
        "include": style_paths,
        "test": /\.scss$|\.sass$/,
        "use": [
          "style-loader",
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "embedded",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": true,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "include": style_paths,
        "test": /\.less$/,
        "use": [
          "style-loader",
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "embedded",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": true
            }
          }
        ]
      },
      {
        "include": style_paths,
        "test": /\.styl$/,
        "use": [
          "style-loader",
          {
            "loader": "raw-loader"
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "embedded",
              "plugins": postcssPlugins,
              "sourceMap": true
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": true,
              "paths": []
            }
          }
        ]
      }
    ]
  },
  "plugins": [
    new NamedLazyChunksWebpackPlugin(),
    new HtmlWebpackPlugin({
      "template": "./" + path.join("src", "laravel-ng-template.html"),
      "filename": path.join("..", "..", "resources", "views", APP_DIR + ".blade.php"),
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
            return 1;
        }
        else if (leftIndex < rightindex) {
            return -1;
        }
        else {
            return 0;
        }
    }
    }),
    new CommonsChunkPlugin({
      "name": [
        "vendor"
      ],
      "minChunks": (module) => {
                return module.resource
                    && (module.resource.startsWith(nodeModules)
                        || module.resource.startsWith(genDirNodeModules)
                        || module.resource.startsWith(realNodeModules));
            },
      "chunks": [
        "main"
      ]
    }),
    new SourceMapDevToolPlugin({
      "filename": "[file].map[query]",
      "moduleFilenameTemplate": "[resource-path]",
      "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
      "sourceRoot": "webpack:///"
    }),
    new NamedModulesPlugin({}),
    new AngularCompilerPlugin({
      "mainPath": "main.ts",
      "platform": 0,
      "hostReplacementPaths": {
        "environments/environment.ts": "environments/environment.ts"
      },
      "sourceMap": true,
      "tsConfigPath": path.join("src", "tsconfig.app.json"),
      "skipCodeGeneration": true,
      "compilerOptions": {}
    })
    ,
    new CleanPlugin(APP_PATH, {root: path.dirname(APP_PATH), allowExternal: true})
  ]
});
