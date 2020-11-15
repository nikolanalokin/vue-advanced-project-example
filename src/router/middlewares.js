import store from '../store'
import * as types from '../store/mutation-types'

export function mainMiddleware (to, from, next) {
  store.dispatch(types.APPBAR_UPDATE_BY_ROUTER, { to, from })
  store.dispatch(types.MODAL_CLOSE_ALL)
  next()
}
