const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const gulpIf = require("gulp-if");
const del = require("del");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
var pug = require("gulp-pug");
const imagemin = require("gulp-imagemin");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const cssnano = require("cssnano");
const husky = require("husky");
var ghpages = require("gh-pages");

var dist = "public";

const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("styles", function () {
  return gulp
    .src("src/styles/pages/*", { since: gulp.lastRun("styles") })
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulpIf(isDevelopment, sourcemaps.write(".")))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
});

gulp.task("pug", function () {
  return gulp
    .src("src/views/pages/**/*.pug", { since: gulp.lastRun("pug") })
    .pipe(pug())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("images", function () {
  return gulp
    .src("src/images/*", { since: gulp.lastRun("images") })
    .pipe(imagemin())
    .pipe(gulp.dest(dist));
});

gulp.task("git-publish", function (cb) {
  ghpages.publish(dist);
  cb();
});

gulp.task("clean", function () {
  return del(dist);
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("styles", "images", "pug"))
);

gulp.task("deploy", gulp.series("build", "git-publish"));

gulp.task("watch", function () {
  gulp.watch("src/styles/**/*.scss", gulp.series("styles"));
  gulp.watch("src/views/**/*.pug", gulp.series("pug"));
  gulp.watch("src/images/*", gulp.series("images"));
});

gulp.task("server", function () {
  browserSync.init({
    server: dist,
  });

  browserSync.watch(dist + "/**/*.*").on("change", browserSync.reload);
});

gulp.task("default", gulp.series("build", gulp.parallel("watch", "server")));
