import config from './config'
import errorHandler from './helpers/errorHandler'
import named from 'vinyl-named'
import connect from 'gulp-connect'
import configWebpack from './index'
import proxy from 'http-proxy-middleware'
import copyremotefile from 'copy-remote-file'
import del from 'del'
import env from 'gulp-env'
import webpackGulp from 'webpack-stream'
import webpack from 'webpack'
import gulp from 'gulp'
import path from 'path'

let envs = { NODE_ENV: config.NODE_ENV }
module.exports = (userConfig) => {
  var dest = userConfig.dest || './www'

  gulp.task('webpack', () =>
    gulp
    .src([])
    .pipe(env.set(envs))
    .pipe(errorHandler())
    .pipe(named())
    .pipe(webpackGulp(configWebpack(path, webpack, userConfig)))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload())
  )

  gulp.task('connect', () =>
    connect.server({
      root: dest,
      port: userConfig.port,
      livereload: true,
      middleware: function(connect, opt) {
        let proxys = []

        if (userConfig.proxy) {
          for (let i = 0; i < userConfig.proxy.length; i++) {
            proxys.push(proxy(userConfig.proxy[i].source, {
              target: userConfig.proxy[i].target,
              changeOrigin: true,
              secure: false,
              headers: {
                Connection: 'keep-alive'
              }
            }))
          }
        }

        return proxys
      }
    })
  )

  gulp.task('meta', cb => {
    try {
      del.sync('./src/statics/meta-info/**/*.*')
    } catch (e) {
      console.log('%s do not clean', dest)
    }
    copyremotefile(userConfig.metaInfoUrl, path.resolve('./src/statics/meta-info/'))
  })

  gulp.task('clean', cb => {
    try {
      del.sync(dest)
    } catch (e) {
      console.log('%s do not clean', dest)
    }
  })

  gulp.task('build', ['clean', 'webpack'])
  gulp.task('default', ['clean', 'webpack', 'connect'])

}
