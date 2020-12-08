/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const babel = require("gulp-babel");
const less = require("gulp-less");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("gulp-cssnano");
const through2 = require("through2");

const paths = {
  dest: {
    lib: "lib", // commonjs 文件存放的目录名 - 本块关注
    esm: "esm", // ES module 文件存放的目录名 - 暂时不关心
    dist: "dist", // umd文件存放的目录名 - 暂时不关心
  },
  styles: "src/components/**/*.less", // 样式文件路径
  scripts: ["src/components/**/*.{ts,tsx}", "!src/components/**/demo/*.{ts,tsx}"], // 脚本文件路径
};
function cssInjection(content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, ".css");
}
function compileCJS() {
  const { dest } = paths;
  return compileScripts("", dest.lib);
}
/**
 * 编译esm
 */
function compileESM() {
  const { dest } = paths;
  return compileScripts("esm", dest.esm);
}
/**
 * 编译脚本文件
 * @param {string} babelEnv babel环境变量
 * @param {string} destDir 目标目录
 */
function compileScripts(babelEnv, destDir) {
  const { scripts } = paths;
  // 设置环境变量
  process.env.NODE_ENV = babelEnv;
  console.log(process.env.NODE_ENV);
  return gulp
    .src(scripts)
    .pipe(babel()) // 使用gulp-babel处理
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());
        // 找到目标
        // 找到目标
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(cssInjection(content)); // 处理文件内容
          file.path = file.path.replace(/index\.js/, "css.js"); // 文件重命名
          this.push(file); // 新增该文件
          next();
        } else {
          next();
        }
      }),
    )
    .pipe(gulp.dest(destDir));
}

/**
 * 拷贝less文件
 */
function copyLess() {
  return gulp.src(paths.styles).pipe(gulp.dest(paths.dest.lib)).pipe(gulp.dest(paths.dest.esm));
}

function sass2css() {
  return gulp
    .src(paths.styles)
    .pipe(less()) // 处理sass文件
    .pipe(postcss([autoprefixer()])) // 根据browserslistrc增加前缀
    .pipe(cssnano({ zindex: false, reduceIdents: false })) // 压缩
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}
// 并行任务 后续加入样式处理 可以并行处理
const build = gulp.parallel(compileCJS, compileESM, copyLess, sass2css);

exports.build = build;
exports.default = build;
