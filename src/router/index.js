import Vue from 'vue'
import Router from 'vue-router'

import { mainMiddleware } from './middlewares'
import { routes } from './routes'

Vue.use(Router)

const RETURN_SCROLL_POSITION_PAGES = [
  'licence',
  'terms',
  'ccterms',
  'userProfile',
  'communityProfile',
  'placeProfile',
  'eventProfile'
]

const router = new Router({
  linkActiveClass: 'router-link-active',
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) return savedPosition
    else if (RETURN_SCROLL_POSITION_PAGES.includes(to.name)) return { x: 0, y: 0 }
    else return null
  },
  routes
})

router.beforeEach(mainMiddleware)

export default router