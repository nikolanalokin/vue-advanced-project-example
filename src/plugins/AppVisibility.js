import { isSSR } from './Platform'

export default {
  appVisible: false,

  install ({ Vue }) {
    if (isSSR) {
      this.appVisible = Vue.prototype.$appVisible = true
      return
    }

    let prop, evt

    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      prop = 'hidden'
      evt = 'visibilitychange'
    }
    else if (typeof document.msHidden !== 'undefined') {
      prop = 'msHidden'
      evt = 'msvisibilitychange'
    }
    else if (typeof document.webkitHidden !== 'undefined') {
      prop = 'webkitHidden'
      evt = 'webkitvisibilitychange'
    }

    const update = () => {
      this.appVisible = Vue.prototype.$appVisible = !document[prop]
    }

    update()

    if (evt && typeof document[prop] !== 'undefined') {
      Vue.util.defineReactive(Vue.prototype, '$appVisible', this.appVisible)
      document.addEventListener(evt, update, false)
    }
  }
}
