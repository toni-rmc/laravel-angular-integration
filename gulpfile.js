var gulp = require('gulp');
var path = require('path');
var del = require('del');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var minifyJS = require('gulp-uglify');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-htmlmin');
var pump = require('pump');
var argv = require('yargs').argv;
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var tsProject = ts.createProject('tsconfig.json');
var tap = require('gulp-tap');
var deleteEmptyDirs = require('delete-empty');
var log = require('logalot');
var colors = require('colors/safe');

/**
 * Actions and globs grouped in one place.
 *
 * @var  object
 */
var actions = new Actions();

// Move JS files to distribution directory.
gulp.task('js', actions.emitJS());

// Move HTML files to distribution directory.
gulp.task('html', actions.emitHTML());

// Move CSS files to distribution directory.
gulp.task('css', actions.emitCSS());

// Compile SCSS and SASS files into CSS and move them to distribution directory.
gulp.task('sass', actions.compileSASS());

// Move JS, HTML, CSS and SASS/SCSS files to distribution directory.
// SASS and SCSS files will be compiled to CSS.
gulp.task('publish', ['js', 'html', 'css', 'sass']);

// Compile TS files into JS and move them to distribution directory.
gulp.task('compile', ['publish'], actions.compileTS());

// Initialize entire Angular environment.
gulp.task('initNg', actions.initializeAngular());

// Publish 3rd party packages Angular applications will use.
gulp.task('publish-packages', actions.publishPackages());

// Delete published 3rd party packages from Angular directory.
gulp.task('delete-packages', actions.deletePackages());

// Initialize Angular environment, publish packages and compile and distribute Angular apps.
gulp.task('bootstrapNg', ['initNg', 'publish-packages', 'compile']);

// Assembles files and directories to be cleaned from distribution directory.
gulp.task('assemble-for-clean', actions.assembleForCleaning());

// Cleans distribution directory.
// Cleans only files and directories that exist in build directory
// with the exception of "js", "css" and "fonts" directories.
// It does remove files and directories within "dist/js", "dist/css" and "dist/fonts" that
// exist in "build/js", "build/css" and "build/fonts" directories.
gulp.task('clean', ['assemble-for-clean'], actions.clean());

// Watch project changes, optionally turn on browser synchronization with --sync switch.
gulp.task('watch', actions.watch());

// Remove empty directories from build and/or distribution directories.
// Pass "--build" switch to clean only build directory and "--dist" switch
// to clean only distribution directory.
gulp.task('remove-empty-dirs', actions.removeEmptyDirs());

function Actions()
{
	/**
     * Directory in your project root where all Angular apps live.
     * This is build directory in which you doing Angular related work.
     *
     * @access private
     * @var  string
     */
    var angular_apps = 'angular_apps';

    /**
     * Directory where Angular lives.
     *
     * @access private
     * @var  string
     */
    var angular_dir = 'public/Ng';

    /**
     * Default Laravel public directory.
     *
     * @access private
     * @var  string
     */
    var destination = 'public';

    /**
     * Host and port. You might need to change this depending on
     * which address and port you started your application.
     * This setting matches default host and port when "php artisan serve"
     * is used to start developing server.
     *
     * @access private
     * @var  string
     */
    var host_port = 'localhost:8000';

    /**
     * Ignore browser sync on Angular distribution directory.
     *
     * @access private
     * @var  string
     */
    var ignore_sync_dir = angular_dir + '/**';

    /**
     * Array of files and directories to be cleaned from distribution directory.
     *
     * @access private
     * @var  array
     */
    var tbc = [];

    /**
     * All globs in one place.
     *
     * @access private
     * @var  object
     */
    var Globs = {
	    typescript_compile: [angular_apps + '/**/*.ts'],
        js:                 [angular_apps + '/**/*.js'],
        html:               [angular_apps + '/**/*.html'],
        css:                [angular_apps + '/**/*.css'],
        sass:               [angular_apps + '/**/*.scss', angular_apps + '/**/*.sass'],
    };

    /**
     * Get absolute destination file path.
     *
     * @access private
     * @param  object  vinyl
     * @return string
     */
    function getDestinationFilePath(vinyl)
    {
        var filePathFromSrc = path.relative(path.resolve(angular_apps), vinyl.history[0]);
        var destFilePath = path.resolve('public', filePathFromSrc);
        return destFilePath;
    }

    /**
     * Print file action taken to notify user about file "add", "change" and "unlink" events.
     *
     * @access private
     * @param  string  destFilePath
     * @param  string  event
     * @return void
     */
    function fileEventNotify(destFilePath, event)
    {
        var e = (event == 'unlink') ? 'DELETED' : (event == 'add') ? 'ADDED' : 'CHANGED';
        var color = (event == 'unlink') ? colors.gray : (event == 'add') ? colors.blue : colors.yellow;
        log.info(e);
        console.log(color(destFilePath));
    }

    /**
     * Create function that initializes Angular environment.
     * Copy everything Angular related from "node_modules" to distribution directory.
     *
     * @access public
     * @return function
     */
    this.initializeAngular = function ()
    {
        var angular_directory = angular_dir;

        return function ()
        {
            return gulp.src(
            [
                'node_modules/@angular/**/*',
                'node_modules/angular-in-memory-web-api/**/*',
                'node_modules/core-js/**/*',
                'node_modules/rxjs/**/*',
                'node_modules/systemjs/**/*',
                'node_modules/zone.js/**/*',
            ], { "base" : "node_modules" }).pipe(gulp.dest(angular_directory));
        }
    };

    /**
     * Create function that compiles TypeScript and distributes compiled .js files.
     *
     * @access public
     * @param  array|string|null  glob
     * @param  string|null  dest
     * @return function
     */
    this.compileTS = function (glob, dest)
    {
    	var __glob = glob || Globs.typescript_compile;
    	var __dest = dest || destination;

	    return function (cb)
        {
            var tsResult = gulp.src(__glob)
                               .pipe(tsProject());

            pump([
                    tsResult.js.pipe(gulpif(argv.minifyJS, minifyJS())),
                    gulp.dest(__dest)
                ],
                cb);
        }
    };

    /**
     * Create function that puts JS files in distribution.
     *
     * @access public
     * @param  array|string|null  glob
     * @param  string|null  dest
     * @return function
     */
    this.emitJS = function (glob, dest)
    {
    	var __glob = glob || Globs.js;
    	var __dest = dest || destination;

	    return function (cb)
        {
            pump([
                    gulp.src(__glob),
                    gulp.dest(__dest)
                ],
                cb);
        }
    };

    /**
     * Create function that puts HTML files in distribution.
     *
     * @access public
     * @param  array|string|null  glob
     * @param  string|null  dest
     * @return function
     */
    this.emitHTML = function (glob, dest)
    {
    	var __glob = glob || Globs.html;
    	var __dest = dest || destination;

        return function (cb)
        {
            pump([
                    gulp.src(__glob),
                    gulpif(argv.minifyHTML, minifyHTML({collapseWhitespace: true})),
                    gulp.dest(__dest)
                ],
                cb);
        }
    };

    /**
     * Create function that puts CSS files in distribution.
     *
     * @access public
     * @param  array|string|null  glob
     * @param  string|null  dest
     * @return function
     */
    this.emitCSS = function (glob, dest)
    {
    	var __glob = glob || Globs.css;
    	var __dest = dest || destination;

        return function (cb)
        {
            pump([
                    gulp.src(__glob),
                    gulpif(argv.minifyCSS, minifyCSS()),
                    gulp.dest(__dest)
                ],
                cb);
        }
    };

    /**
     * Create function that compiles SASS/SCSS and distributes compiled .css files.
     *
     * @access public
     * @param  array|string|null  glob
     * @param  string|null  dest
     * @return function
     */
    this.compileSASS = function (glob, dest)
    {
    	var __glob = glob || Globs.sass;
    	var __dest = dest || destination;
        var min_sass = null;

        if (argv.minifySASS)
        {
            min_sass = {outputStyle: 'compressed'};
        }

        return function (cb)
        {
            pump([
                    gulp.src(__glob),
                    sass(min_sass).on('error', sass.logError),
                    gulp.dest(__dest)
                ],
                cb);
        }
    };

    /**
     * Create function that initializes browser synchronization and watching.
     *
     * @access public
     * @param  string|null  hp
     * @param  string|null  isd
     * @return function
     */
    this.synchronizeBrowsers = function (hp, isd)
    {
        var __host_port = hp || host_port;
        var __ignore_sync_dir = isd || ignore_sync_dir;

    	return function ()
    	{
            browserSync.init({
                proxy: {
                    target: __host_port,
                    ws: true
                },
                watchOptions: {
                    ignored: __ignore_sync_dir
                }
            });

            // Reload browsers if any file changes in public directory
            // except in Angular subdirectory.
            browserSync.watch([destination + '/**'], {ignored: __ignore_sync_dir})
                .on('change', browserSync.reload)
                .on('unlink', browserSync.reload)
                .on('add', browserSync.reload);
        }
    };

    /**
     * Create function that starts watchers on TS, JS, HTML and CSS files.
     * Watchers listen for "add", "change" and "unlink" events and they call
     * emit functions on "add" and "change" events and delete function on "unlink" event.
     * TypeScript files will be compiled into JavaScript first.
     *
     * @access public
     * @return function
     */
    this.watch = function ()
    {
        var actions = this;
        var ts_compile = Globs.typescript_compile;
        var js_html_css_compile = [].concat(Globs.js, Globs.html, Globs.css);
        var sass_compile = Globs.sass;

        return function ()
        {
            // Watch for TS changes.
            watch(ts_compile, function (vinyl) {

                let destFilePath = getDestinationFilePath(vinyl);

                // Replace .ts with .js to match compiled and distributed JS file.
                let lastDot = destFilePath.lastIndexOf('.');
                destFilePath = destFilePath.substring(0, lastDot) + '.js';

                if (vinyl.event == 'unlink')
                {
                    del.sync(destFilePath);
                }
                else
                {
                    actions.compileTS()();
                }

                fileEventNotify(destFilePath, vinyl.event);
            });

            // Watch for JS, HTML and CSS changes.
            watch(js_html_css_compile, function (vinyl) {

                let destFilePath = getDestinationFilePath(vinyl);
                if (vinyl.event == 'unlink')
                {
                    del.sync(destFilePath);
                }
                else
                {
                    // Follow convention to call appropriate function with correct glob.

                    // Returns "js", "html", or "css".
                    let extension = destFilePath.split('.').pop();

                    // Forge "emitJS", "emitHTML" or "emitCSS".
                    let emit = 'emit' + extension.toUpperCase();

                    actions[emit]()();
                }

                fileEventNotify(destFilePath, vinyl.event);
            });

            // Watch for SASS changes.
            watch(sass_compile, function (vinyl) {

                let destFilePath = getDestinationFilePath(vinyl);

                // Replace .scss or .sass with .js to match compiled and distributed CSS file.
                let lastDot = destFilePath.lastIndexOf('.');
                destFilePath = destFilePath.substring(0, lastDot) + '.css';

                if (vinyl.event == 'unlink')
                {
                    del.sync(destFilePath);
                }
                else
                {
                    actions.compileSASS()();
                }

                fileEventNotify(destFilePath, vinyl.event);
            });

            // Use browser sync if specified with a --sync switch.
            if (argv.sync)
            {
                // Initialize browser synchronization.
                var host_port = null;

                if (argv.hp)
                {
                    host_port = argv.hp;
                }

                actions.synchronizeBrowsers(host_port)();
            }
        }
    };

    /**
     * Create function that goes trough build directory and assemble files.
     * Modify paths to point to the distribution directory.
     * If file suffix is ".ts" replace it with ".js".
     * Store values in tbc[] so that this array can be used by the
     * deletion method in the parent task.
     *
     * @access public
     * @return function
     */
    this.assembleForCleaning = function ()
    {
        var cl = [].concat(Globs.typescript_compile, Globs.js, Globs.html, Globs.css, Globs.sass);

        return function ()
        {
            return gulp.src(cl, {read: false})
                .pipe(tap(function (file, t) {
                    var base = file.base;
                    var p = base.lastIndexOf(angular_apps);
                    base = base.substring(0, p) + destination;
                    var f = file.path.replace(file.base.slice(0, -1), base);

                    if (path.extname(f) === '.ts')
                    {
                        let lastDot = f.lastIndexOf('.');
                        f = f.substring(0, lastDot) + '.js';
                    }
                    else if (path.extname(f) === '.scss' || path.extname(f) === '.sass')
                    {
                        let lastDot = f.lastIndexOf('.');
                        f = f.substring(0, lastDot) + '.css';
                    }

                    // Push files to be deleted.
                    tbc.push(f);
                }));
        }
    };

    /**
     * Create function that cleans files and empty directories from
     * the distribution directory and notifies the user.
     * Delete only files that are also present in the build directory.
     *
     * @access public
     * @return function
     */
    this.clean = function ()
    {
        return function ()
        {
        	// Delete files.
        	console.log('');
        	log.info('Deleting Files:');
        	console.log('');

            var deleted_files = del.sync(tbc);

            if (deleted_files.length <= 0) { log.success('No files to delete'); }

            for (var i = 0; i < deleted_files.length; i++)
            {
            	log.success(colors.gray(deleted_files[i]));
            }

            // Delete directories.
            console.log('');
            log.info('Deleting directories:');
            console.log('');

            var deleted_dirs = deleteEmptyDirs.sync(destination + '/');

            if (deleted_dirs.length <= 0) { log.success('No directories to delete'); }

            console.log('');
            log.info('Deleted: ' + colors.cyan(deleted_files.length + ' files') + ' and ' + colors.cyan(deleted_dirs.length + ' directories'));
            console.log('');

            // Clear files-to-be-cleaned array.
            tbc = [];
        }
    };

    /**
     * Create function that publishes 3rd party libraries Angular apps may need.
     * Read libraries from array and copy them from "node_modules" to the Angular directory.
     *
     * @access public
     * @return function
     */
    this.publishPackages = function ()
    {
        var angular_directory = angular_dir;

        const external = require('./resources/assets/js/ng-vendor');
        let e = external.vendor_libraries();

        let _3rd_party_libs = e.map(function (el) {return 'node_modules/' + el + '/**/*'; });

        return function ()
        {
            return gulp.src(
                _3rd_party_libs, { "base" : "node_modules" }).pipe(gulp.dest(angular_directory));
        }
    };

    /**
     * Create function that deletes 3rd party libraries.
     * Read libraries from array and delete them from the Angular directory.
     *
     * @access public
     * @return function
     */
    this.deletePackages = function ()
    {
        const external = require('./resources/assets/js/ng-vendor');
        let e = external.vendor_libraries();

        let _3rd_party_libs = e.map(function (el) {return angular_dir + '/' + el + '/**'; });

        return function ()
        {
            return del.sync(_3rd_party_libs);
        }
    };

    /**
     * Create function that removes empty directories from
     * build and distribution directories.
     *
     * @access public
     * @return function
     */
    this.removeEmptyDirs = function ()
    {
        var build = false;
        var dist = false;

        // If no switches are passed, remove from both build and distribution
        if (( ! argv.build) && ( ! argv.dist))
        {
            build = dist = true;
        }
        else
        {
            if (argv.build) { build = true; }
            if (argv.dist) { dist = true; }
        }

        return function ()
        {
            if (build)
            {
                deleteEmptyDirs(angular_apps + '/', function () {});
            }

            if (dist)
            {
                deleteEmptyDirs(destination + '/', function () {});
            }
        }
    };
} // End of the Actions class
