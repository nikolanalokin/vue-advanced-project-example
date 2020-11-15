<template>

  <div id="app">
    <template v-if="appInited">
      <transition name="page-transition" mode="out-in">
        <router-view></router-view>
      </transition>

      <Utils />
    </template>
  </div>

</template>

<script>

import * as types from './store/mutation-types'
import { mapGetters, mapMutations } from 'vuex'

import debug from 'debug'
const appLogger = debug('app:app-component')

export default {
  name: 'App',
  data () {
    return {
      loading: false,
      netStatusOnline: null
    }
  },
  watch: {
    '$appVisible' (val) {
      if (val == true) {
        appLogger('On App visible >> isAccessTokenExpired: %s', this.$store.getters.isAccessTokenExpired);
        this.$store.dispatch(types.AUTH_CHECK)
      }
    },
    netStatusOnline (val) {
      // appLogger('netStatusOnline', val);
    }
  },
  computed: {
    ...mapGetters([
      'appInited'
    ])
  },
  methods: {
    ...mapMutations([
      'setUserContextActivated'
    ]),
    setNetStatusOnline () {
      this.netStatusOnline = true
    },
    setNetStatusOffline () {
      this.netStatusOnline = false
    },
    onGlobalMouseDown () {
      this.setUserContextActivated(true)
      window.removeEventListener('mousedown', this.onGlobalMouseDown)
    }
  },

  created () {
    window.addEventListener('mousedown', this.onGlobalMouseDown)
  },
  mounted () {
    appLogger('[mounted]App')
    this.netStatusOnline = navigator.onLine

    window.addEventListener('online', this.setNetStatusOnline)
    window.addEventListener('offline', this.setNetStatusOffline)
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.onGlobalMouseDown)
    window.removeEventListener('online', this.setNetStatusOnline)
    window.removeEventListener('offline', this.setNetStatusOffline)
  },

  meta () {
    return {
      title: this.$route.meta.title || '',
      titleTemplate: (titleChunk) => {
        return /* this.$isAuthenticated ? titleChunk :  */titleChunk ? `${titleChunk} | App` : 'App name'
      },
      meta: [
        {
          vmid: 'og:site_name',
          property: 'og:site_name',
          content: 'App'
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://liveonce.ru' + this.$router.resolve(this.$route).href
        }
      ]
    }
  }
}

</script>