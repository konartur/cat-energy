const gulp = require("gulp");
const sass = require("gulp-sass");

gulp.task("styles", function () {
  return gulp.src("src/**/*.scss").pipe(sass()).pipe(gulp.dest("public"));
});
