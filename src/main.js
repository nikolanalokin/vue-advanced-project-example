localStorage.debug = process.env.NODE_ENV == 'development' ? 'app:*,api:*,store:*,models:*,components:*,notify:*,utils:*' : false

import createApp from './app'

global.APP = createApp()

APP.init().then(() => {
  APP.Vue.$mount('#app')
})