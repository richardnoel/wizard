"use strict";
var gulp = require("gulp");
var concat = require("gulp-concat");
var JavaScriptObfuscator = require('javascript-obfuscator');
var read = require('read-file');
const fs = require('fs');
const writeFile = require('write');

var jsConfig = function (destiny, name) {
	this.files = {
		base: [
			"./src/unikit.js",
			"./src/js/utils/basic-function.js",
			"./src/js/utils/showcase-directives.js",
			"./src/js/plugins/angular-datatables.js",
			"./src/js/config.js",
			"./src/js/base/fn-convert.js",
			"./src/js/base/fn-validator.js",
			"./src/js/base/fn-part.js",
			"./src/js/base/fn-compile.js",
			"./src/js/base/fn-tree.js",
			"./src/js/base/fn-plus.js",
			"./src/js/base/fn-confirm.js",
			"./src/js/base/fn-option.js",
			"./src/js/base/fn-lov.js",
			"./src/js/base/ui-group.js",
			"./src/js/base/ui-input.js",
			"./src/js/base/ui-editor.js",
			"./src/js/base/ui-select.js",
			"./src/js/base/ui-filter.js",
			"./src/js/base/ui-grid.js",
			"./src/js/base/ui-badge.js",
			"./src/js/base/ui-action.js",
			"./src/js/base/ui-panel.js",
			"./src/js/base/ui-panels.js",
			"./src/js/base/ui-table.js",
			"./src/js/base/ui-scroll.js",
			"./src/js/base/ui-image.js",
			"./src/js/filter/ftr-code.js",
			"./src/js/filter/ftr-param.js",
			"./src/js/filter/ftr-typeof.js",
			"./src/js/filter/ftr-trusted.js",
			"./src/js/embedded/em-table.js",
			"./src/js/embedded/em-pager.js",
			"./src/js/embedded/em-filter.js",
			"./src/js/handler/basic-handler.js",
			"./src/js/handler/param-handler.js",
			"./src/js/handler/action-handler.js",
			"./src/js/handler/data-handler.js",
			"./src/js/handler/filter-handler.js",
			"./src/js/handler/list-handler.js",
			"./src/js/handler/panel-handler.js",
			"./src/js/handler/part-handler.js",
			"./src/js/handler/view-handler.js",
			"./src/js/handler/serv-handler.js",
			"./src/js/handler/lov-handler.js",
			"./src/plugins/scrollbar/perfect-scrollbar.js",
			"./src/js/utils/download.js"
		],
		modules: [
			"./src/modules/uni-report.js"
		],
		support: [
			"./src/js/utils/showcase-directives.js"
		]
	};
	this.destiny = destiny;
	this.buildName = name || "webkit";
};

var copyFiles = function (files, dest) {
	gulp.src(files)
									.pipe(gulp.dest(dest));
};

jsConfig.prototype.dev = function (mode) {
	var files = [];
	if (mode === "production") {
		for (var type in this.files) {
			if (type !== "support") {
				files = files.concat(this.files[type]);
			}
		}
	} else {
		for (var type in this.files) {
			files = files.concat(this.files[type]);
		}
	}
	//console.log(files, this.buildName + ".js", this.destiny + "/webkit");
	return gulp.src(files)
									.pipe(concat(this.buildName + ".js"))
									.pipe(gulp.dest(this.destiny + "/webkit"));
};

jsConfig.prototype.prod = function () {
	var that = this;
	setTimeout(function () {
		var filePath = that.destiny + "/webkit/" + that.buildName + ".js";
		if (fs.existsSync(filePath)) {
			read(filePath, {encoding: 'utf8'}, function (err, buffer) {
				if (err) {
					console.log(err);
				}
				var configObfusator = {
					compact: true,
					sourceMap: true,
					sourceMapMode: "separate",
					disableConsoleOutput: true,
					mangle: true,
					log: true,
					rotateStringArray: true,
					selfDefending: true,
					stringArray: true,
					stringArrayThreshold: 0.75
				};
				var obfuscationResult = JavaScriptObfuscator.obfuscate(buffer, configObfusator);
				writeFile.promise(filePath, obfuscationResult.getObfuscatedCode())
												.then(function () {
													console.log("Obfuscacion completada");
												});
				fs.open(that.destiny + '/webkit/build.js.map', 'wx', (err, fd) => {
					if (err) {
						console.log(err);
					}
					writeFile.promise(that.destiny + '/webkit/build.js.map', obfuscationResult.getSourceMap())
													.then(function () {
														console.log("sourceMap completado");
													});
				});
			});
		} else {
			that.prod();
		}
	}, 1000);
};

if (typeof exports !== "undefined") {
	module.exports = jsConfig;
}
