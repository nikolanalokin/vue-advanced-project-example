import * as types from '../mutation-types'
import { events } from '../../utils/bus'

import debug from 'debug'
const logger = debug('store:modal')

export default {
  state: () => ({
    currentModalName: '',
    history: [],
    opened: false,
    locked: false
  }),
  mutations: {
    [types.MODAL_SET_LOCK] (state, value) {
      state.locked = value
    },
  },
  actions: {
    [types.MODAL_OPEN] ({ state, commit, getters }, data) {
      let name = ''

      if (typeof data == 'object') name = data.name
      else name = data

      if (!state.history.includes(name)) {
        state.history.push(name)
        state.currentModalName = name
      }

      if (getters.modalHistoryLength == 1) {
        document.querySelector('body').style.overflow = 'hidden'
        state.opened = true
      }

      events.$emit('modal:open', name, data.payload, data.cb)
    },
    [types.MODAL_CLOSE] ({ state, commit, getters }) {
      if (state.locked) return false

      if (getters.modalHistoryLength == 1) {
        state.opened = false
        state.currentModalName = ''

        document.querySelector('body').style.overflow = ''
      } else {
        state.currentModalName = state.history[getters.modalCurrentIndex - 1]
      }

      state.history.pop()
    },
    [types.MODAL_CLOSE_ALL] ({ state, commit, getters }, value) {
      if (state.locked) return false
      
      state.history = []
      state.currentModalName = ''
      state.opened = false
      
      document.querySelector('body').style.overflow = ''
    },
  },
  getters: {
    modalCurrentName: state => {
      return state.currentModalName
    },
    modalCurrentIndex: state => {
      return state.history.indexOf(state.currentModalName)
    },
    modalHistory: state => {
      return state.history
    },
    modalHistoryLength: state => {
      return state.history.length
    },
    modalOpened: state => {
      return state.opened
    }
  }
}