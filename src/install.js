import Platform from './plugins/Platform'
// import Screen from './plugins/Screen'

export const queues = {
  server: [], // on SSR update
  takeover: [] // on client takeover
}

let __installed = false

export default function (Vue, opts = {}) {
  if (__installed) { return }
  __installed = true

  Platform.install({ Vue, queues })
  // Screen.install({ Vue, queues })

  opts.components && Object.keys(opts.components).forEach(key => {
    const c = opts.components[key]
    Vue.component(c.name, c)
  })

  opts.directives && Object.keys(opts.directives).forEach(key => {
    const d = opts.directives[key]
    if (d.name !== undefined && d.unbind !== void 0) {
      Vue.directive(d.name, d)
    }
  })

  if (opts.plugins) {
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function' && p !== Platform && p !== Screen) {
        p.install({ Vue, queues })
      }
    })
  }
}
