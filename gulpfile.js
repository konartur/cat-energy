const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const gulpIf = require("gulp-if");
const del = require("del");
const newer = require("gulp-newer");
const autoprefixer = require("gulp-autoprefixer");
const remember = require("gulp-remember");
const cached = require("gulp-cached");
const path = require("path");
const browserSync = require("browser-sync").create();

const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("styles", function () {
  return gulp
    .src("styles/main.scss")
    .pipe(cached("styles"))
    .pipe(autoprefixer())
    .pipe(remember("styles"))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(gulpIf(isDevelopment, sourcemaps.write(".")))
    .pipe(gulp.dest("public"));
});

gulp.task("clean", function () {
  return del("public");
});

gulp.task("assets", function () {
  return gulp
    .src("assets/**", { since: gulp.lastRun("assets") })
    .pipe(newer("public"))
    .pipe(gulp.dest("public"));
});

gulp.task("build", gulp.series("clean", gulp.parallel("styles", "assets")));

gulp.task("watch", function () {
  gulp.watch("styles/**/*.*", gulp.series("styles"));

  gulp.watch("assets/**/*.*".gulp.series("assets"));
});

gulp.task("server", function () {
  browserSync.init({
    server: "public",
  });

  browserSync.watch("public/**/*.*").on("change", browserSync.reload);
});

gulp.task("dev", gulp.series("build", gulp.parallel("watch", "server")));
