import * as types from '../mutation-types'
import API from '../../services/api'

import debug from 'debug'
const logger = debug('store:account')

export default {
  state: () => ({
    online: false,
    timer: null
  }),
  mutations: {
    [types.ACCOUNT_SET_ONLINE] (state) {
      if (!state.online) state.online = true
    },
    [types.ACCOUNT_SET_OFFLINE] (state) {
      if (state.online) state.online = false
    },
  },
  actions: {
    async [types.ACCOUNT_SET_ONLINE] ({commit, state}) {
      try {
        let response = await API.account.setOnline()
        commit(types.ACCOUNT_SET_ONLINE)
        return response
      } catch (error) {
        console.warn(error);
      }
    },

    async [types.ACCOUNT_SET_OFFLINE] ({commit, state}) {
      try {
        let response = await API.account.setOffline()
        return response
      } catch (error) {
        console.warn(error);
      } finally {
        commit(types.ACCOUNT_SET_OFFLINE)
      }
    }
    
  },
  getters: {
    isOnline: state => state.online
  }
}