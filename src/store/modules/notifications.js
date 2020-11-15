import * as types from '../mutation-types'

import debug from 'debug'
const logger = debug('store:notifications')

export default {
  state: () => ({
    enabled: localStorage.getItem('n:enabled') == 0 ? false : true,
    soundEnabled: localStorage.getItem('n:sound_enabled') == 0 ? false : true,
  }),
  mutations: {
    [types.NOTIFICATIONS_SET_ENABLED] (state, value) {
      state.enabled = value
      localStorage.setItem('n:enabled', value == true ? 1 : 0)
    },

    [types.NOTIFICATIONS_SET_SOUND_ENABLED] (state, value) {
      state.soundEnabled = value
      localStorage.setItem('n:sound_enabled', value == true ? 1 : 0)
    },
  },
  actions: {},
  getters: {
    notifEnabled: state => {
      return state.enabled
    },
    notifSoundEnabled: state => {
      return state.soundEnabled
    }
  }
}