"use strict";
var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var cssConfig = function (destiny, name) {
	this.files = {
		base: [
			"./src/css/unikit.css",
			"./src/css/badge.css",
			"./src/css/loader.css",
			"./src/css/action.css",
			"./src/css/table.css",
			"./src/css/pager.css",
			"./src/css/modal.css",
			"./src/css/confirm.css",
			"./src/css/sort.css",
			"./src/css/plus.css",
			"./src/css/validator.css",
			"./src/css/tree.css",
			"./src/css/grid.css",
			"./src/css/panel.css",
			"./src/css/panels.css",
			"./src/plugins/scrollbar/perfect-scrollbar.css",
			"./src/css/image.css"
		],
		others: [
			"./src/css/unikit-showcase.css",
			"./src/css/showcase-doc.css"
		]
	};
	this.destiny = destiny;
	this.buildName = name || "webkit";
};

cssConfig.prototype.dev = function () {
	var files = this.files.base.concat(this.files.others);
	return gulp.src(files)
									.pipe(concat(this.buildName + ".css"))
									.pipe(gulp.dest(this.destiny + "/webkit"));
};

cssConfig.prototype.prod = function () {
	var that = this;
	setTimeout(function () {
		return gulp.src(that.files.base)
										.pipe(concat(that.buildName + ".css"))
										.pipe(sourcemaps.init())
										.pipe(sourcemaps.init({loadMaps: true}))
										.pipe(cleanCSS())
										.pipe(sourcemaps.write(that.destiny + "/webkit"))
										.pipe(gulp.dest(that.destiny + "/webkit"));
	}, 1500);

};

if (typeof exports !== "undefined") {
	module.exports = cssConfig;
}
