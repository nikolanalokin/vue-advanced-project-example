import { events } from '../utils/bus'
import uuid from '../utils/uuid'

import debug from 'debug'
const logger = debug('notify:plugin')

let queue = []
let componentInited = false

export default {
  install ({ Vue }) {
    if (this.__installed) return
    this.__installed = true
    
    function notify (data) {
      data.id = uuid.short('notify')
      queue.push(data)
      logger('send new notify with data: %O', data)
      if (componentInited) {
        events.$emit('notify:add', data)
      }
    }

    events.$on('notify:added', (id) => {
      logger('event -> notify:added')
      let index = queue.findIndex(v => v.id == id)
      if (index > -1) queue.splice(index, 1)
    })

    events.$on('notify:component-inited', () => {
      logger('event -> notify:component-inited')
      componentInited = true
      queue.forEach(v => {
        events.$emit('notify:add', v)
      })
    })
    
    Vue.prototype.$notify = notify
    Vue.notify = notify
  }
}