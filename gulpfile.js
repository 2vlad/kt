var gulp = require('gulp');
var del = require('del');
var path = require('path');
var _ = require('underscore/underscore');
var cloneDeep = require('lodash.clonedeep');
var runSequence = require('run-sequence').use(gulp);

var svgSprite = require('gulp-svg-sprite');

var gulpWebpack = require('./tools/frontend/gulp.webpack.js');
var webpackConfig = require('./webpack.config.js');
var BundleTracker = require('webpack-bundle-tracker');

var webpackConfigs = {
	front: cloneDeep(webpackConfig)
};

gulp.task('setDevVars', function () {
	_.each(webpackConfigs, function (config) {
		config.devtool = 'cheap-module-source-map';
		config.watch = true;
		config.cache = true;
	});
});

gulp.task('setProductionVars', function () {
	_.each(webpackConfigs, function (config) {
		config.devtool = 'source-map';
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

gulp.task('assets', function () {
	gulp.src('assets/custom_libs/**/*')
		.pipe(gulp.dest('static/custom_libs/'));
	gulp.src('assets/img/**/*')
		.pipe(gulp.dest('static/img'));
	gulp.src('assets/fonts/**/*')
		.pipe(gulp.dest('static/fonts'));
	gulp.src('assets/favicon/**/*')
		.pipe(gulp.dest('static/favicon'));
	gulp.src('assets/svg/**/*')
		.pipe(gulp.dest('static/svg'));
});

gulp.task('svg', ['svg-front']);

gulp.task('svg-front', function () {
	return gulp.src('assets/svg/front/*.svg')
		.pipe(svgSprite({
			mode: {
				symbol: true
			}
		}))
		.pipe(gulp.dest('static/svg/front'));
});

gulp.task('watch', function () {
	gulp.watch('assets/css/libs/**/*', {interval: 1000}, ['assets']);
	gulp.watch('assets/js/libs/**/*', {interval: 1000}, ['assets']);
	gulp.watch('assets/img/**/*', {interval: 1000}, ['assets']);
	gulp.watch('assets/fonts/**/*', {interval: 1000}, ['assets']);
});

gulp.task('default', ['setDevVars', 'js', 'svg', 'assets', 'watch']);

gulp.task('test', function (callback) {
	runSequence(['setProductionVars', 'js', 'svg', 'assets'], callback);
});

gulp.task('production', function (callback) {
	runSequence(['setProductionVars', 'js', 'svg', 'assets'], callback);
});
