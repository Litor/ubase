import {
  Vue,
  VueRouter,
  VueResource,
  Vuex
} from './lib'
import app from './app'
import {
  preLoadResource,
  setRouter,
  getConfig,
  setRootApp,
  setStore,
  setRequestAnimation
} from './utils'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Vuex)

setRequestAnimation()

function boot(store, routes) {
  var config = getConfig()

  const router = new VueRouter({
    root: '',
    linkActiveClass: 'active',
    hashbang: true,
    routes: routes
  })
  setRouter(router)
  setStore(store)

  var rootApp = new Vue({
    router,
    render: h => h('router-view'),
    data: () => ({
      config: config
    }),
    store
  })

  setRootApp(rootApp)

  store = new Vuex.Store(store)

  preLoadResource(function () {
    rootApp.$mount(document.getElementsByTagName('app')[0])
  }, routes)
}

export  {boot}
