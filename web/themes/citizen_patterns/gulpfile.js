/* globals require */

(function () {
  'use strict';

  // General
  var gulp = require('gulp-help')(require('gulp'));

  const _ = require('lodash');
  const portscanner = require('portscanner');
  const browserSync = require('browser-sync').create();
  const babel = require('gulp-babel');
  const sourcemaps = require('gulp-sourcemaps');
  const defaultConfig = require('./gulp-config');
  // eslint-disable-next-line no-redeclare, no-var
  var config = _.defaultsDeep(config, defaultConfig);
  // deploy
  const ghpages = require('gh-pages');

  const tasks = {
    compile: [],
    watch: [],
    validate: [],
    default: [],
  };

  var clean = require('gulp-clean');

  // SCSS/CSS
  require('./gulp-tasks/gulp-css.js')(gulp, config, tasks, browserSync);

  /**
   * Script Task
   */
  gulp.task('scripts', () => {
    gulp
      .src(config.paths.js)
      .pipe(sourcemaps.init())
      .pipe(
        babel({
          presets: ['env', 'minify'],
        })
      )
      .pipe(sourcemaps.write(config.themeDir))
      .pipe(gulp.dest(config.paths.dist_js));
  });

  // Find open port using portscanner.
  let openPort = '';
  portscanner.findAPortNotInUse(3000, 3010, '127.0.0.1', (error, port) => {
    openPort = port;
  });

  // Pattern Lab
  require('./gulp-tasks/gulp-pattern-lab.js')(gulp, config, tasks, browserSync, openPort);

  /**
   * Task for running browserSync.
   */
  gulp.task('serve', ['css', 'scripts', 'watch:pl'], () => {
    if (config.browserSync.domain) {
      browserSync.init({
        injectChanges: true,
        open: config.browserSync.openBrowserAtStart,
        proxy: config.browserSync.domain,
        startPath: config.browserSync.startPath
      });
    } else {
      browserSync.init({
        injectChanges: true,
        server: {
          baseDir: config.browserSync.baseDir,
        },
        startPath: config.browserSync.startPath,
        notify: config.browserSync.notify,
        ui: config.browserSync.ui,
        open: config.browserSync.openBrowserAtStart,
        reloadOnRestart: config.browserSync.reloadOnRestart,
        port: openPort
      });
    }
    gulp.watch(config.paths.js, ['scripts']);
    gulp.watch(`${config.paths.sass}/**/*.scss`, ['css']).on('change', (event) => {});
    gulp.watch(config.patternLab.scssToYAML[0].src, ['pl:scss-to-yaml']);
  });

  /**
   * Theme task declaration
   */
  gulp.task('theme', ['serve']);

  gulp.task('compile', tasks.compile);
  gulp.task('validate', tasks.validate);
  gulp.task('watch', tasks.watch);
  tasks.default.push('watch');
  gulp.task('default', tasks.default);

  /**
   * Theme task declaration
   */
  gulp.task('build', ['compile', 'scripts', 'css']);

  /**
   * Deploy
   */
  gulp.task('createBuild', () => {
    gulp
      .src(
        [
          `${config.paths.dist_js}/**/*`,
          `${config.paths.pattern_lab}/**/*`,
          `${config.paths.theme_images}/**/*`,
          `${config.paths.logo}`,
          `${config.themeDir}/CNAME`,
        ],
        { base: config.themeDir }
      )
      .pipe(gulp.dest('build'));
  });

  gulp.task('githubPublish', () => {
    // Publish the build directory to github pages.
    ghpages.publish(`${config.themeDir}build`, (err) => {
      if (err === undefined) {
        // eslint-disable-next-line no-console
        console.log('Successfully deployed!');
      } else {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  });

  gulp.task('ghpages-deploy', ['createBuild', 'githubPublish']);


  //remove pattern lab js files in prep for rebuild
  gulp.task('jsClean', function () {
    return gulp.src('./pattern-lab/public/js/**/*.js', {read: false})
      .pipe(clean({force: true}));
  });

  //rebuild js files used in pattern lab
  gulp.task('scriptRefresh', ['jsClean'], () => {
    gulp
      .src('./components/js/**/*.js')
      .pipe(gulp.dest('./pattern-lab/public/js'));
  });

})();
