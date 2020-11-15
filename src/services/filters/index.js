import Vue from 'vue'
import { startCase } from 'lodash'

import {
  getLinkByData,
  getValuesAsString,
  getLink
} from '../../utils'

Vue.filter('getLinkByData', (val) => {
  if (val) return getLinkByData(val)
  else return ''
})
Vue.filter('getValuesAsString', (val) => {
  if (val) return getValuesAsString(val)
  else return ''
})
Vue.filter('startCase', (val) => {
  if (val) return startCase(val)
  else return ''
})
Vue.filter('getLink', (val) => {
  if (val) return getLink(val)
  else return ''
})