<script>

import NPageSticky from '../layout/NPageSticky.vue'
import { getScrollTarget, setScrollPosition } from '../../../utils/scroll'

export default {
  name: 'NPageScroller',

  mixins: [ NPageSticky ],

  props: {
    scrollOffset: {
      type: Number,
      default: 1000
    },

    duration: {
      type: Number,
      default: 300
    },

    offset: {
      default: () => [18, 18]
    }
  },

  inject: {
    layout: {
      default () {
        console.error('NPageScroller needs to be used within a NLayout')
      }
    }
  },

  data () {
    return {
      showing: this.__isVisible(this.layout.scroll.position)
    }
  },

  watch: {
    'layout.scroll.position' (val) {
      const newVal = this.__isVisible(val)
      if (this.showing !== newVal) {
        this.showing = newVal
      }
    }
  },

  methods: {
    __isVisible (val) {
      return val > this.scrollOffset
    },

    __onClick (e) {
      const target = this.layout.container === true
        ? getScrollTarget(this.$el)
        : getScrollTarget(this.layout.$el)

      console.log(target);

      setScrollPosition(target, 0, this.duration)
      this.$listeners.click !== void 0 && this.$emit('click', e)
    }
  },

  render (h) {
    return h('transition', {
      props: { name: 'n-transition--fade' }
    },
    this.showing === true
      ? [
        h('div', {
          staticClass: 'n-page-scroller',
          on: {
            ...this.$listeners,
            click: this.__onClick
          }
        }, [
          NPageSticky.render.call(this, h)
        ])
      ]
      : null
    )
  }
}

</script>