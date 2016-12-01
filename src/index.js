import {
  Vue,
  Vuex,
  i18n
} from './lib'

import jquery from 'jquery'
import lodash from 'lodash'
import {boot} from './boot'
import {invoke} from './eventManager'
import $script from 'scriptjs'

import {
  setConfig,
  getConfig,
  initLoadingAnimation,
  showLoading,
  hideLoading,
  updateState,
} from './utils'

// ubase对应用开发暴露的接口
window.$b = {}
window.$b.showLoading = showLoading // 异步动画显示
window.$b.hideLoading = hideLoading // 异步动画关闭
window.$b.updateState = updateState // 更新state
window.$b.invoke = invoke // 跨组件触发方法
window.$b.beforeInit = null // 定制应用启动前处理钩子 params {config，router, routes，rootApp, next}

// ubase 生成app入口文件时用的私有方法
window._UBASE_PRIVATE = {}
window._UBASE_PRIVATE.startApp = startApp
window._UBASE_PRIVATE.init = appInit
window._UBASE_PRIVATE.initI18n = initI18n

/* ================start window全局变量=================== */
window.$ = jquery
window.jQuery = jquery
window._ = lodash
window.$script = $script
window.Vue = Vue

/* ================end window全局变量=================== */

// 同步获取app的config信息, 在app启动时第一步执行
function appInit(next, useConfigFile) {
  // 如果项目不需要configfile则直接next
  if(useConfigFile === null || useConfigFile === false){
    setConfig({})
    next()
    return
  }else{
    showLoading()
    $.ajax({
      url: './config.json'
    }).done(function (res) {
      hideLoading()
      setConfig(res)
      next && next()
    }).fail(function (e) {
      console.error('获取config.json是发生错误！')
    })
  }
}

// 初始化国际化 获取config信息后第二步执行
function initI18n(next, useI18n) {
  if(!useI18n){
    next()
    return
  }
  var langUrl = './' + (getConfig()['LANG'] || 'cn') + '.lang.json'
  showLoading()
  $.ajax({
    url: langUrl
  }).done((res) => {
    var lang = getConfig()['LANG'] || 'cn'
    var locales = {}
    locales[lang] = res
    Vue.use(i18n, {
      lang: lang,
      locales: locales
    })
    hideLoading()
    next()
  }).fail(function () {
    console.error('获取国际化文件时出错！')
  })
}

// 应用启动入口
function startApp(unused, store, routes) {
  initLoadingAnimation()
  boot(store, routes)
}
