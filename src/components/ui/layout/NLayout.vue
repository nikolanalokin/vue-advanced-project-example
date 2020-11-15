<template>

  <div class="n-layout">
    <NScrollObserver @scroll="__onPageScroll" />
    <NResizeObserver @resize="__onPageResize" :debounce="0" />
    <slot />
  </div>

</template>

<script>

import { throttle } from 'lodash'
import bus from '../../../utils/bus'
import * as  types from '../../../store/mutation-types'

export default {
  name: 'NLayout',

  data () {
    return {
      // page related
      height: window.innerHeight,
      width: window.innerWidth,

      header: {
        size: 0,
        offset: 0,
        space: false
      },
      footer: {
        size: 0,
        offset: 0,
        space: false
      },

      scroll: {
        position: 0,
        direction: 'down'
      },

      scrollWidth: 0
    }
  },

  provide () {
    return {
      layout: this
    }
  },
  
  methods: {
    __onPageScroll (data) {
      this.scroll = data
      this.$listeners.scroll !== void 0 && this.$emit('scroll', data)
      bus.$emit('scroll', data)
    },

    __onPageResize ({ height, width }) {
      let resized = false

      if (this.height !== height) {
        resized = true
        this.height = height
        if (this.$listeners['scroll-height'] !== void 0) {
          this.$emit('scroll-height', height)
        }
      }
      if (this.width !== width) {
        resized = true
        this.width = width
        this.scrollWidth = window.innerWidth - document.documentElement.clientWidth
      }

      if (resized === true && this.$listeners.resize !== void 0) {
        this.$emit('resize', { height, width })
      }
    },
  },
  
  created () {
    this.instances = {}
  },

  mounted () {
    // this.throttledHandleScroll = throttle(this.handleScroll, 100)
    // this.$el.addEventListener('scroll', this.throttledHandleScroll, false)
  },

  beforeDestroy () {
    // this.$el.removeEventListener('scroll', this.throttledHandleScroll, false)
  }
}

</script>