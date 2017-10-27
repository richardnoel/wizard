"use strict";
var fs = require('fs');
var help = require('./../src/js/utils/netbenas-help.js');

var jsonConfig = function (destiny, name) {
 this.destiny = destiny;
 this.buildName = name || "webkit";
};

jsonConfig.prototype.dev = function () {
 var fileName = './src/js/config.js';
 var customs = help().run(fileName);
 var fileNameOut = this.destiny + '/webkit/' + this.buildName + '.json';
 //console.log('*******************************************', fileNameOut);
 //fs.writeFileSync(fileNameOut, JSON.stringify(customs, null, '\t'), 'utf-8');
 fs.writeFileSync(fileNameOut, JSON.stringify(customs), 'utf-8');
};

jsonConfig.prototype.prod = function () {
//    return gulp.src(this.files)
//            .pipe(concat(this.buildName + ".min.js"))
//            .pipe(uglify())
//            .pipe(obfuscator({
//                compact:true,
//                sourceMap: true
//            }))
//            .pipe(gulp.dest(this.destiny + "/webkit"));
};

if (typeof exports !== "undefined") {
 module.exports = jsonConfig;
}
