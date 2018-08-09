# Configurando Gulp@4.0.0
Gulp en su versión 4.0.0 nos muestra que podemos escribir su configuración usando el estandar ES6 de JavaScript. Les mostraré una sencilla configuración basándome en este y otros cambios que nos trae esta version.

Primero debemos instalar los paquetes `gulp-cli` y `gulp`, de forma global y local, respectivamente, en nuestro entorno de desarrollo:

```shell
$ npm i -g gulp-cli
$ npm i -D gulp
```

Gulp trae esta nueva característica que les comento arriba, pero para poder ejecutar correctamente ese código debemos instalar otro paquete que nos permitirá usarla. Esto se debe a que Node.js no tiene un soporte completo para ES6. Así que instalaremos los siguiente paquetes:

  -  `babel-core`
  -  `babel-preset-env`

Usamos el siguiente comando para instalar ambos paquetes como dependencias de desarrollo:

```shell
$ npm i -D babel-core babel-preset-env
```

## Añadiendo archivo .babelrc
Luego de instalar las dos dependencias anteriores, debemos indicarle a Node.js cuales serán las configuraciones que necesitaremos para ejecutar Gulp con ES6. Esto lo hacemos ***creando*** el archivo `.babelrc` y añadiendo el siguiente contenido:

```json
{
  "presets": ["env"]
}
```

## Configurando PostCSS y sus plugins
En esta configuración usaremos el paquete `gulp-postcss`.

```shell
$ npm i -D gulp-postcss
```

Otros paquetes que podemos instalar para optimizar nuestro código CSS con PostCSS son:

| Paquete | README |
| ------- | ------ |
| autoprefixer | [autoprefixer/README.md][PlAp] |
| css-mqpacker | [css-mqpacker/READMEmd][PlMq] |
| cssnano | [cssnano/README.md][PlNa] |
| postcss-cssnext | [postcss-cssnext/README.md][PlNx] |
| postcss-font-magician | [postcss-font-magician/README.md][PlFm] |
| postcss-import | [postcss-import/README.md][PlIm] |
| stylelint | [stylelint/README.md][PlSl] |

Instalamos usando el siguiente comando:

```shell
$ npm i -D autoprefixer css-mqpacker cssnano postcss-cssnext postcss-font-magician postcss-import stylelint
```

Notemos que todas son dependencias de desarrollo.

## Agregando BrowserSync
BrowserSync nos ayuda a mejorar nuestro flujo de trabajo al recargar el navegador cada vez que detecta un cambio en los archivos que le indiquemos. Para agregar esta configuración necesitamos el paquete `browser-sync`, que instalaremos a continuación:

```shell
$ npm i -D browser-sync
```

## Creando el archivo gulpfile.babel.js
Ahora estamos preparados para crear el archivo de configuración que utilizará Gulp para ejecutarse.

Dentro de la raiz de nuestro proyecto ejecutamos:

```shell
$ touch gulpfile.babel.js
```

Luego con nuestro editor de texto favorito continuamos a editarlo para agregar las configuraciones. En mi caso uso SublimeText3.

Primero debemos importar cada uno de los módulos que usaremos y asignarles un alias:

```javascript
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
```

Luego agregamos las funciones que usará Gulp:

```javascript
const paths = {
  css: {
    src: 'src/**/*.css',
    dest: 'dist/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  }
}

// Servidor de desarrollo
export const serve = (done) => {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    },
    port: 9000
  })
  done();
}

// Recarga del Navegador
export const reload = (done) => {
  browserSync.reload()
  done()
}

// Procesamiento de CSS
export const css = () => {
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
        'Open Sans': {
          '300': [],
          '700': []
        }
      }
    }),
    CSSnext({
      features: {
        autoprefixer: {
          // grid: true,
          // flexbox: false,
          browsers: [
            '> 5%'
          ]
        },
        customProperties: false,
        calc: false,
      }
    }),
    mqpacker(),
    // CSSnano()
  ]

  return (gulp
      .src(paths.css.src)
      .pipe(postcss(processors))
      .pipe(gulp.dest(paths.css.dest))
      .pipe(browserSync.stream()))
}

// Procesamiento de HTML
export const html = () => {
  return (gulp
      .src(paths.html.src)
      .pipe(gulp.dest(paths.html.dest)))
}

// Vigilar cambios
export const watch = () => {
  gulp.watch(paths.html.src, gulp.series(html, reload))
  gulp.watch(paths.css.src, gulp.series(css, reload))
}
```

Por último agregamos la tarea que por defecto ejecutará Gulp:

```javascript
gulp.task('default', gulp.parallel(watch, serve))
```

## Referencias

Para escribir esta guía utilizamos recursos que otras personas ya habían elaborado:

* [gulp-postcss] - PostCSS gulp plugin to pipe CSS through several plugins, but parse CSS only once.
* [marceloogeda] - My Gulpfile using ES6 (Babel), Browserify, BrowserSync, SASS, Sourcemaps, and more...
* [Adnan Rahić] - How to automate all the things with Gulp
* [Stylelint] - Configuration
* [Scotty Vernon @creativenigthly] - How to lint your Sass/CSS properly with Stylelint
* [gulpjs@GitHub] - Minimal BrowserSync setup with Gulp 4
* [Gulp@GitHub] - The streaming build system
* [Jérôme Coupé @webstoemp] - Switching to Gulp 4

**Buen trabajo, así se hace!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [Jérôme Coupé @webstoemp]: <https://www.webstoemp.com/blog/switching-to-gulp4/>
   [Gulp@GitHub]: <https://github.com/gulpjs/gulp/blob/4.0/README.md>
   [gulpjs@GitHub]: <https://github.com/gulpjs/gulp/blob/master/docs/recipes/minimal-browsersync-setup-with-gulp4.md>
   [Scotty Vernon @creativenigthly]: <http://www.creativenightly.com/2016/02/How-to-lint-your-css-with-stylelint/#extending-stylelint-with-plugins>
   [Stylelint]: <https://stylelint.io/user-guide/configuration/#plugins>
   [Adnan Rahić]: <https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885>
   [marceloogeda]: <https://gist.github.com/marceloogeda/5a449caa50462ab2667540a93d34009f>
   [gulp-postcss]: <https://github.com/postcss/gulp-postcss/blob/master/README.md>

   [PlAp]: <https://github.com/postcss/autoprefixer/blob/master/README.md>
   [PlMq]: <https://github.com/hail2u/node-css-mqpacker/blob/master/README.md>
