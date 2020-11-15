import * as types from '../mutation-types'
import API from '../../services/api'
import Timer from '../../utils/timer'
import { tsNow } from '../../utils'

import debug from 'debug'
const logger = debug('store:auth')

const TOKEN_LIFE = 1800

export default {
  state: () => ({
    timer: null,
    accessToken: '',
    refreshToken: '',
    accessTokenExpDate: '',
    uid: null,

    onlineStatusTimer: null
  }),
  mutations: {
    [types.AUTH_CLEAR_DATA] (state) {
      state.accessToken = ''
      state.refreshToken = ''
      state.accessTokenExpDate = ''
      state.uid = null

      localStorage.removeItem('a:at')
      localStorage.removeItem('a:rt')
      localStorage.removeItem('a:exp_date')
      localStorage.removeItem('a:uid')
      
      if (state.timer) state.timer.stop()
    },
    [types.AUTH_SET_DATA] (state, { refresh_token, access_token, expires_in, reg_time, user_id }) {
      state.accessToken = access_token
      state.refreshToken = refresh_token
      state.accessTokenExpDate = TOKEN_LIFE + tsNow()
      state.uid = +user_id

      localStorage.setItem('a:at', state.accessToken)
      localStorage.setItem('a:rt', state.refreshToken)
      localStorage.setItem('a:exp_date', state.accessTokenExpDate)
      localStorage.setItem('a:uid', state.uid)
    },
  },
  actions: {
    async [types.AUTH_REGISTER] ({ state, commit, dispatch}, data) {
      try {
        commit(types.AUTH_SET_DATA, data)
      } catch (err) {
        console.warn(err)
      }
    },

    async [types.AUTH_LOG_IN] ({ commit, getters }, { login, password }) {
      try {
        let response = await API.auth.logIn({ login, password })
        commit(types.AUTH_SET_DATA, response)
        return response
      } catch (err) {
        throw err
      }
    },

    async [types.AUTH_REFRESH] ({ state, commit }) {
      try {
        let response = await API.auth.refresh({ refresh_token: state.refreshToken })
        if (process.env.NODE_ENV == 'development') logger('refresh response %O', response);
        commit(types.AUTH_SET_DATA, response)
        return response
      } catch (err) {
        console.warn(err)
        throw err
      }
    },

    async [types.AUTH_LOG_OUT] ({ commit, state, dispatch, getters }) {
      try {
        if (state.onlineStatusTimer) {
          state.onlineStatusTimer.stop()
          state.onlineStatusTimer = null
        }
      
        await dispatch(types.ACCOUNT_SET_OFFLINE)
        await API.auth.remove({ access_token: state.accessToken })
      } catch (err) {
        console.warn(err)
      } finally {
        commit(types.AUTH_CLEAR_DATA)
        commit(types.USER_CLEAR_DATA)
      }
    },

    [types.AUTH_CHECK] ({ commit, state, dispatch, getters}) {
      if (getters.isAccessTokenExpired && state.timer) {
        state.timer.stop()

        dispatch(types.AUTH_REFRESH)
        .then(() => {
          state.timer = new Timer({
            interval: TOKEN_LIFE * 1000,
            ontick: () => {
              dispatch(types.AUTH_REFRESH)
            }, 
            runCallbackOnStart: false, 
            loop: true
          })
        })
      }
    },

    async [types.AUTH_INIT] ({ commit, state, dispatch, getters}) {
      try {
        let data = {
          accessToken:        localStorage.getItem('a:at'),
          refreshToken:       localStorage.getItem('a:rt'),
          accessTokenExpDate: localStorage.getItem('a:exp_date'),
          uid:                localStorage.getItem('a:uid'),
        }
  
        if (!data.refreshToken) return
  
        state.accessToken = data.accessToken
        state.refreshToken = data.refreshToken
        state.accessTokenExpDate = +data.accessTokenExpDate
        state.uid = +data.uid
  
        let delay = (!state.accessToken || (state.accessTokenExpDate - tsNow()) < 0) ? 0 : (state.accessTokenExpDate - tsNow()) * 1000
        if (process.env.NODE_ENV == 'development') logger('auth init timer delay: %d', delay);
  
        if (delay == 0) {
          await dispatch(types.AUTH_REFRESH)
  
          state.timer = new Timer({
            interval: TOKEN_LIFE * 1000,
            ontick: () => {
              dispatch(types.AUTH_REFRESH)
            }, 
            runCallbackOnStart: false, 
            loop: true
          })
        }
        else {
          setTimeout(() => {
            state.timer = new Timer({
              interval: TOKEN_LIFE * 1000,
              ontick: () => {
                dispatch(types.AUTH_REFRESH)
              }, 
              runCallbackOnStart: true, 
              loop: true
            })
          }, delay)
        }
  
        state.onlineStatusTimer = new Timer({
          interval: 3e5,
          ontick: () => {
            dispatch(types.ACCOUNT_SET_ONLINE)
          }, 
          runCallbackOnStart: true, 
          loop: true
        })
  
        return {
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          accessTokenExpDate: state.accessTokenExpDate,
          uid: state.uid
        }
      }
      catch (err) {
        commit(types.AUTH_CLEAR_DATA)
        commit(types.USER_CLEAR_DATA)
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.accessToken && !!state.refreshToken,
    accessToken: state => state.accessToken,
    refreshToken: state => state.refreshToken,
    accessTokenExpDate: state => state.accessTokenExpDate,
    isAccessTokenExpired: state => state.accessTokenExpDate < tsNow(),
    uid: state => state.uid
  }
}