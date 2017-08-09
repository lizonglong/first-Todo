var gulp = require("gulp");//引入gulp
// var gulpminHtml = require("gulp-minify-html");//压缩html
var $ = require("gulp-load-plugins")();//引进所有的包(实际并非所有的包)
var open = require("open");  //引进open

//lib
gulp.task("lib",function () {
    gulp.src("src/lib/**/*.js")
        .pipe(gulp.dest("build/lib/"))
        .pipe(gulp.dest("dev/lib/"))
});

//复制html
gulp.task("html",function(){
    gulp.src("src/*.html")  //读取文件
        .pipe(gulp.dest("build"))//复制到开发环境
        .pipe($.minifyHtml())//压缩
        .pipe(gulp.dest("dev"))//复制到生产环境
        .pipe($.connect.reload());
})
//压缩js
gulp.task("js",function () {
    gulp.src("src/js/*.js")
        .pipe($.concat("index.js"))//合并js
        .pipe(gulp.dest("build/js"))
        .pipe($.uglify())
        .pipe(gulp.dest("dev/js"))
        .pipe($.connect.reload());
})

//压缩css
gulp.task("css",function () {
    gulp.src("src/css/*.css")
        .pipe(gulp.dest("build/css"))
        .pipe($.cssmin())
        .pipe(gulp.dest("dev/css"))
        .pipe($.connect.reload());
})

//压缩img
gulp.task("img",function () {
    gulp.src("src/images/*")
        .pipe(gulp.dest("build/img"))
        .pipe($.imagemin())
        .pipe(gulp.dest("dev/img"))
        .pipe($.connect.reload());
})

//删除
gulp.task("clean",function () {
    gulp.src(["build/","dev/"])
        .pipe($.clean())
})

//总任务
gulp.task("task01",["html","js","css","img","lib"])

//自动刷新、自动打开
gulp.task("server",function () {
    $.connect.server({
        root:"build/",
        port:2233,
        livereload:true
    })
    open("http://localhost:2233")
     // gulp.watch("src/*",["html","css","js","img"])
    gulp.watch("src/*.html",["html"])
    gulp.watch("src/css/*.css",["css"])
    gulp.watch("src/js/*.js",["js"])
    gulp.watch("src/images/*",["img"])
})

//默认
gulp.task("default",["server"])