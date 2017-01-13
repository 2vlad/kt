var gulp = require('gulp');
var del = require('del');
var path = require('path');
var _ = require('underscore/underscore');
var cloneDeep = require('lodash.clonedeep');

var gulpWebpack = require('./tools/frontend/gulp.webpack.js');
var webpackConfig = require('./webpack.config.js');
var BundleTracker = require('webpack-bundle-tracker');

var webpackConfigs = {
    front: cloneDeep(webpackConfig)
};

gulp.task('setDevVars', function () {
    _.each(webpackConfigs, function (config) {
        config.watch = true;
        config.cache = true;
    });
});

gulp.task('setProductionVars', function () {
    _.each(webpackConfigs, function (config) {
        config.devtool = 'cheap-source-map';
        config.watch = false;
        config.cache = false;
        // config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyConfig));
    });
});

gulp.task('js', ['js-front']);

gulp.task('js-front', function () {
    del(['static/app/front/**/*']);

    var config = webpackConfigs.front;

    config.entry = './assets/app/front/App';
    config.output.path = path.join(__dirname, 'static', 'app', 'front');
    config.plugins.push(new BundleTracker({filename: './webpack.front.stats.json'}));

    gulpWebpack(webpackConfigs.front);
});

gulp.task('watch', function () {
    gulp.watch('assets/css/libs/**/*', {interval: 1000}, ['assets']);
    gulp.watch('assets/js/libs/**/*', {interval: 1000}, ['assets']);
    gulp.watch('assets/img/**/*', {interval: 1000}, ['assets']);
    gulp.watch('assets/fonts/**/*', {interval: 1000}, ['assets']);
});

gulp.task('default', ['setDevVars', 'js', 'watch']);
