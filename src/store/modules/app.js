import * as types from '../mutation-types'
import { setWindowTitle } from '../../utils'

import barData from '../../data/bar.json'

import { merge } from 'lodash'

import debug from 'debug'
const logger = debug('store:app')

export default {
  state: () => ({
    inited: false,
    currentbar: {},
    userContextActivated: false
  }),
  mutations: {
    setAppInited (state, value) {
      state.inited = value
    },
    setUserContextActivated (state, value) {
      state.userContextActivated = value
    }
  },
  actions: {
    [types.APPBAR_UPDATE_BY_CODE] ({ state, rootState }, { data, method = 'merge' }) {
      if (method == 'merge') {
        state.currentbar = merge(state.currentbar, data)
      }
      if (method == 'assign') {
        state.currentbar = Object.assign({}, barData[rootState.route.name], data)
      }
    },
    [types.APPBAR_UPDATE_BY_ROUTER] ({ state, getters, rootState }, { to = {}, from = {} }) {
      if (barData[to.name]) setWindowTitle(barData[to.name].title)

      if (to.name != from.name) {
        state.currentbar = barData[to.name]
      }

      if (process.env.NODE_ENV == 'development') logger('current bar %O', state.currentbar)
    },
  },
  getters: {
    currentAppBar: state => state.currentbar,
    appInited: state => state.inited,
    userContextActivated: state => state.userContextActivated
  }
}