'use strict'

const gulp = require('gulp')
const standard = require('gulp-standard')

gulp.task('lint', function gulpLint () {
  return gulp.src(['lib/*.js', 'test/*.js', 'gulpfile.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
})
