import debug from 'debug'
const appLogger = debug('app:vue')

import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import router from './router'
import store from './store'

// Инициализация компонентов
import components from './components'
import * as directives from './directives'
import * as plugins from './plugins'

import Install from './install'

Install(Vue, {
  components,
  directives,
  plugins,
})

import './services/filters'

import Meta from 'vue-meta'
Vue.use(Meta, {
  keyName: 'meta',
  attribute: 'data-vue-meta',
  ssrAttribute: 'data-vue-meta-server-rendered',
  tagIDKeyName: 'vmid',
  refreshOnceOnNavigation: true
})

import './sass/index.scss'

import { app, currentUser } from './mixins'
Vue.mixin(app)
Vue.mixin(currentUser)

import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)

import './libs/quill/emoji/index'

import PortalVue from 'portal-vue'
Vue.use(PortalVue)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import Validations from 'vuelidate'
Vue.use(Validations)

import i18n from './localization'

import { Settings } from 'luxon'
Settings.defaultLocale = i18n.locale

import { sync } from 'vuex-router-sync'

import { getLinkByData, tsNow } from './utils'
import * as types from './store/mutation-types'

import API from './services/api'

class AppClass {
  constructor() {
    /**
     * @property {Vuex} Store - main application storage
    */
    this.Store = store
    /**
     * @property {VueRouter} Router - main client application router
    */
    this.Router = router
    /**
     * @property {VueI18n} I18n - main client application i18n
    */
    this.I18n = i18n

    // Синхронизирум хранилище и роутер
    sync(this.Store, this.Router)
    /**
     * @property {Vue} Vue - main vue application
    */
    this.Vue = new Vue({
      router: this.Router,
      store: this.Store,
      i18n: this.I18n,
      render: h => h(App)
    })
    /** @property {Object} API main api instance */
    this.API = API
  }

  async init () {
    let startTimestamp = tsNow(false)
    try {
      await this.Store.dispatch(types.AUTH_INIT)
      appLogger('Vue created [AUTH_INIT]')
      await this.Store.dispatch(types.USER_INIT)
      appLogger('Vue created [USER_INIT]')
      if (this.Store.getters.isAuthenticated && this.Router.currentRoute.name == 'index') {
        this.Router.replace(getLinkByData(this.Store.getters.currentUser, -1))
        this.Store.commit('setAppInited', null)
      } else {
        this.Store.commit('setAppInited', true)
      }
      appLogger(`startup time: ${tsNow(false) - startTimestamp}ms`)
      return true
    } catch (err) {
      console.warn(err)
      this.Store.commit('setAppInited', false)
      throw err
    }
  }
}

export default function createApp () {
  return new AppClass()
}