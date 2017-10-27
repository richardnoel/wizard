"use strict";
var jsonfile = require('jsonfile');
var comments = require('parse-comments');
const readFiles = require('read-files-promise');
var jsDoc = function (destiny, name) {
	this.files = [
		"src/unikit.js",
		"src/js/config.js",
		"src/js/base/fn-convert.js",
		"src/js/base/fn-validator.js",
		"src/js/base/fn-part.js",
		"src/js/base/fn-tree.js",
		"src/js/base/fn-confirm.js",
		"src/js/base/fn-option.js",
		"src/js/base/fn-lov.js",
		"src/js/base/fn-plus.js",
		"src/js/base/ui-group.js",
		"src/js/base/ui-input.js",
		"src/js/base/ui-editor.js",
		"src/js/base/ui-select.js",
		"src/js/base/ui-filter.js",
		"src/js/base/ui-grid.js",
		"src/js/base/ui-badge.js",
		"src/js/base/ui-action.js",
		"src/js/base/ui-panel.js",
		"src/js/base/ui-panels.js",
		"src/js/base/ui-table.js",
		"src/js/base/ui-scroll.js",
		"src/js/base/ui-image.js",
		"src/js/filter/ftr-code.js",
		"src/js/filter/ftr-param.js",
		"src/js/filter/ftr-typeof.js",
		"src/js/embedded/em-table.js",
		"src/js/embedded/em-pager.js",
		"src/js/embedded/em-filter.js"
	];
	this.destiny = destiny;
	this.concatTemp = 'buildD';
	this.buildName = name || "doc";
	this.comments = [];
	this.cache = {};
};

jsDoc.prototype.buildDoc = function () {
	var that = this;
	var indexPath = 0;
	readFiles(this.files, {encoding: 'utf8'})
									.then(onFulfilled, onRejected);
	function onFulfilled(buffers) {
		for (var i = indexPath; i < buffers.length; i += 1) {
			var name = that.files[i].substring(that.files[i].lastIndexOf('/') + 1, that.files[i].length - 3);
			var comm = comments(buffers[i]);
			for (var j = 0; j < comm.length; j += 1) {
				if (comm[j] && comm[j].comment) {
					comm[j].comment.path = "unikit/" + that.files[i];
				}
			}
			that.cache[name] = comm;
		}
		jsonfile.writeFile(that.destiny + '/' + that.buildName, that.cache, function (err) {
		});
	}
	function onRejected(err) {
		console.log(err, 'Cannot read the file.');
	}
};
if (typeof exports !== "undefined") {
	module.exports = jsDoc;
}