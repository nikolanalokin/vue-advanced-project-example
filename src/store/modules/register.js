import * as types from '../mutation-types'

import debug from 'debug'
const logger = debug('store:app')

export default {
  state: () => ({
    data: {
      firstName: null,
      lastName: null,
      city: null,
      country: null,
      sex: null,
      phone: null,
      password: null,
      location: null
    }
  }),
  mutations: {
    [types.REGISTER_SET_DATA] (state, { key, value }) {
      if (typeof value == 'object') state.data = Object.assign({}, state.data, value)
      else state.data[key] = value
    },
    [types.REGISTER_CLEAR_DATA] (state) {
      for (let key in state.data) {
        state.data[key] = null
      }
    },
  },
  actions: {},
  getters: {
    registerData: state => state.data,
  }
}