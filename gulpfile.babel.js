import autoprefixer from 'autoprefixer'
import atImport from 'postcss-import'
import browserSync from 'browser-sync'
import CSSnano from 'cssnano'
import CSSnext from 'postcss-cssnext'
import CSSlint from 'stylelint'
import gulp from 'gulp'
import magician from 'postcss-font-magician'
import mqpacker from 'css-mqpacker'
import postcss from 'gulp-postcss'

// Servidor de desarrollo
const serve = (done) => {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 9000
  })
  done();
}

// Recarga del Navegador
const reload = (done) => {
  browserSync.reload()
  done()
}

// Procesamiento de CSS
const css = () => {
  const processors = [
    atImport({
      plugins: [
        CSSlint({
          "rules": {
            "block-no-empty": true
          }
        })
      ]
    }),
    magician({
      variants: {
        'Lato': {
          '300': [],
          '400': []
        }
      }
    }),
    CSSnext({
      features: {
        autoprefixer: {
          grid: true,
          flexbox: false,
        },
        customProperties: false,
        calc: false,
      }
    }),
    mqpacker(),
    CSSnano()
  ]

  return gulp
    .src('./src/css/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
}

// Procesamiento de HTML
const html = () => {
  return gulp
    .src('./src/*.html')
    .pipe(gulp.dest('./dist'))
}

// Vigilar cambios
const watch = () => {
  gulp.watch('./src/*.html', gulp.series(html, reload))
  gulp.watch('./src/**/*.css', gulp.series(css, reload))
}

// Tareas
gulp.task('default', gulp.parallel(watch, serve))