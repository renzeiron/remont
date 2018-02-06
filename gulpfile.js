var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		rsync          = require('gulp-rsync'),
		mergeStream    = require('merge-stream');

gulp.task('common-js', function() {
	return gulp.src([
		'src/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'src/js/common.min.js',
		// 'src/libs/lightbox2/dist/js/lightbox.min.js',
		'src/libs/popper.js/dist/umd/popper.min.js',
		'src/libs/bootstrap/js/bootstrap.min.js',
		'src/libs/fancybox/dist/jquery.fancybox.min.js'
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('src/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		// server: {
		// 	baseDir: 'src'
		// },

		proxy: 'localhost/remont',
		host: 'localhost',
		port: 80,
  		open: 'local',
		
		notify: false

		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// gulp.task('bootstrap-min', function() {
// 	return gulp.src('src/libs/bootstrap/scss/**/*.scss')
// 	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
// 	.pipe(rename({suffix: '.min', prefix : ''}))
// 	.pipe(autoprefixer(['last 15 versions']))
// 	.pipe(cleanCSS())
// 	.pipe(gulp.dest('src/libs/bootstrap/css'))
// 	.pipe(browserSync.reload({stream: true}));
// });

// gulp.task('bootstrap', ['bootstrap-min'], function() {
// 	return gulp.src('src/libs/bootstrap/scss/**/*.scss')
// 	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
// 	.pipe(autoprefixer(['last 15 versions']))
// 	.pipe(gulp.dest('src/libs/bootstrap/css'))
// 	.pipe(browserSync.reload({stream: true}));
// });

gulp.task('sass', function() {
	return gulp.src('src/scss/**/*.scss')
	.pipe(sass({outputStyle: 'expanded'}).on('error', notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch([
		'src/scss/**/*.scss', 'src/libs/bootstrap/scss/**/*.scss', 'src/libs/font-awesome/scss/**/*.scss'], ['sass']);
	gulp.watch(['src/libs/**/*.js', 'src/js/common.js'], ['js']);
	gulp.watch(['src/*.html', 'src/libs/**/*.php', 'src/*.php'], browserSync.reload);
});

// gulp.task('imagemin', function() {
// 	return gulp.src('src/img/**/*')
// 	.pipe(cache(imagemin()))
// 	.pipe(gulp.dest('dist/img')); 
// });

gulp.task('imagemin', function() {
	// return merge(
	// 	gulp.src('src/img/carousel/*')
	// 	.pipe(cache(imagemin()))
	// 	.pipe(gulp.dest('src/img/carousel')),
	// 	gulp.src('src/img/examples/1/*')
	// 	.pipe(cache(imagemin()))
	// 	.pipe(gulp.dest('src/img/examples/1')),
	// 	gulp.src('src/img/examples/2/*')
	// 	.pipe(cache(imagemin()))
	// 	.pipe(gulp.dest('src/img/examples/2')),
	// 	gulp.src('src/img/examples/3/*')
	// 	.pipe(cache(imagemin()))
	// 	.pipe(gulp.dest('src/img/examples/3')),
	// 	gulp.src('src/img/services/*')
	// 	.pipe(cache(imagemin()))
	// 	.pipe(gulp.dest('src/img/services'))
	// );

	return gulp.src('src/img/services/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('src/img/services'))
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'src/*.html',
		'src/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'src/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'src/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'src/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));
});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		archive: true,
		silent: false,
		compress: true
	}));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
