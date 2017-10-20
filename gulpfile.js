var gulp = require("gulp");
var concat = require("gulp-concat");
var browserSync = require("browser-sync").create();
var runSequence = require("run-sequence")

gulp.task('build', function(){
	var files = require("./config/files.js");
	gulp.src(files.js)
		.pipe(concat("unikit.js"))
		.pipe(gulp.dest("dist/webkit"));
	gulp.src(files.css)
		.pipe(concat("unikit.css"))
		.pipe(gulp.dest("dist/webkit"));
	gulp.src('src/index.html')
		.pipe(gulp.dest('dist/'))
});

gulp.task("local-server", function () {
	browserSync.init({
		server: {
			baseDir: "dist/",
			routes: {
				"/jquery/": "lib/jquery/",
				"/bootstrap/": "lib/bootstrap/",
				"/angularjs/": "lib/angularjs/",
				"/fonts/": "lib/fonts/",
				"/webkit/": "dist/webkit/",
				"/images/": "images/",
			}
		},
		port: "3333",
		online: false,
		open: true
	});
});


gulp.task('watch', function(){
	var filesWatch = ["src/index.html"];
	var files = require("./config/files.js");
	filesWatch = filesWatch.concat(files.js);
	filesWatch = filesWatch.concat(files.css);
	gulp.watch(filesWatch, function(){
		runSequence('build');
		browserSync.reload();
	});
})


gulp.task('default', ['build', 'watch','local-server']);
