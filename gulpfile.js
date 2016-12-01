var gulp = require('gulp');

//引入组件
var htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  pngcrush = require('imagemin-pngcrush'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify');

//压缩html
gulp.task('html',function(){
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('./dest'))
    .pipe(notify({message:'html task ok'}));
});

//压缩图片
gulp.task('img',function(){
  return gulp.src('src/img/*')
    .pipe(imagemin({
      progressive:true,
      svgoPlugins:[{removeViewBox:false}],
      use:[pngcrush()]
    }))
    .pipe(gulp.dest('./dest/img/'))
    .pipe(notify({message:'img task ok'}));
});

//合并、压缩、重命名css
gulp.task('css',function(){
  return gulp.src('src/*.css')
    .pipe(concat('animate.css'))
    .pipe(gulp.dest('dest'))
    .pipe(rename({suffix:'.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dest'))
    .pipe(notify({message:'css task ok'}));
});

//检查js
gulp.task('lint',function(){
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({message:'lint task ok'}));
});

//压缩合并js文件
gulp.task('js',function(){
  return gulp.src('src/*.js')
    .pipe(concat('package.js'))
    .pipe(gulp.dest('dest'))
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dest'))
    .pipe(notify({message:'js task ok'}));
});

//默认任务
gulp.task('default',function(){
  gulp.run('img','css','lint','js','html');

  //监听html文件变化
  gulp.watch('src/*.html',function(){
    gulp.run('html');
  });

  //监听 .css文件变化
  gulp.watch('src/*.css',['css']);

  //监听 .js文件变化
  gulp.watch('src/*.js',['lint','js']);

  //监听图片文件变化
  gulp.watch('src/img/*',['img']);
});