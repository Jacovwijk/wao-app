var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function(){

	browserSync.init({
		proxy: 'localhost:3000'
	})
})

gulp.task('watch', ['browserSync'], function(){
	gulp.watch('public/css/*.css',  browserSync.reload);
	gulp.watch('public/js/*.js', browserSync.reload);
	gulp.watch('public/views/*.html', browserSync.reload);
})

gulp.task('hello', function() {
	console.log('Hello Jaco');
});