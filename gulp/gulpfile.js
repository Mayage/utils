"use strict";
var gulp = require("gulp"),
	GulpLoadPlugins = require("gulp-load-plugins");
var plugins = new GulpLoadPlugins();
gulp.task("minify", function() {
    gulp.src("**/*.js")
    .pipe(plugins.uglify())
    .pipe(plugins.concat("app.js"))
    .pipe(gulp.dest("buildmyg"));
});
