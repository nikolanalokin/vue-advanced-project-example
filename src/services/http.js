/**
 * HTTP request layer
 * if auth is required return patched axios instance(with access token in headers)
 * else return clear axios instance
 */

import axios from 'axios'
import $store from '../store'
import * as types from '../store/mutation-types'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

import { tsNow } from '../utils'

export default class HTTP {
  constructor (opts = null) {
    this.requiredAuth = opts && opts.auth != undefined ? opts.auth : $store.getters.isAuthenticated
    this.version = opts && (opts.v || opts.version) || '1.1' // base version
    this.instance = axios.create({
      baseURL: process.env.VUE_APP_API_URL_BASE,
      responseEncoding: 'utf8',
      responseType: 'json',
      timeout: 30000,
      // cancelToken: source.token
    })

    return this.init()
  }

  init () {
    this.instance.interceptors.request.use(request => {

      if (!request.params) request.params = {}
      request.params.v = this.version

      if (request.method == 'get') {
        request.params.client_id = 1
      }
      if (request.method == 'post') {
        if (!request.data) request.data = new FormData()
        request.data.append('client_id', 1)
      }

      if (this.requiredAuth) {
        if (isAccessTokenExpired()) {
          return $store.dispatch(types.AUTH_REFRESH)
          .then(response => {
            if (!response) throw new Error('undefined')
            
            if (process.env.NODE_ENV == 'development') console.log(`HTTP >> instance.interceptors.request >> got refresh`, response);
            request.headers.Authorization = 'Beaber ' + response.access_token
            return request
          })
          .catch(error => {
            if (process.env.NODE_ENV == 'development') console.log('HTTP >> instance.interceptors.request >> get refresh error', error);
          })
        } else {
          request.headers.Authorization = 'Beaber ' + $store.getters.accessToken
          return request
        }
      }

      return request
      
    }, error => {
      return Promise.reject(error)
    })

    this.interceptor = this.instance.interceptors.response.use(response => {
      // if (response.data && response.data.errors) {
      //   console.log('interceptor response data:', response.data)
      // }
      return response
    }, error => {
      // console.log('interceptor response error:', error.response)
      if (error.response.status === 401 && $store.getters.isAuthenticated) {
        let config = error.response.config

        this.instance.interceptors.response.eject(this.interceptor)
        return $store.dispatch(types.AUTH_REFRESH)
          .then(response => {
            if (!response) throw new Error('undefined')
            
            if (process.env.NODE_ENV == 'development') console.log(`HTTP >> instance.interceptors.response (error) >> got refresh`, response);
            config.headers.Authorization = 'Beaber ' + response.access_token
            return axios(config)
          })
          .catch(error => {
            if (process.env.NODE_ENV == 'development') console.log('HTTP >> instance.interceptors.response (error) >> get refresh error', error);
          })
      } else {
        return Promise.reject(error)
      }
    })

    return this.instance
  }
}

export function isAccessTokenExpired () {
  const accessTokenExpDate = $store.getters.accessTokenExpDate - 1
  return accessTokenExpDate <= tsNow()
}