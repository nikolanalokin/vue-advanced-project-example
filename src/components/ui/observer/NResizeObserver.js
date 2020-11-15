import { listenOpts } from '../../../utils/event'
// import { isSSR } from '../../plugins/Platform'

export default {
  name: 'NResizeObserver',

  props: {
    debounce: {
      type: [String, Number],
      default: 100
    }
  },

  data () {
    return this.hasObserver
      ? {}
      : { url: 'about:blank' }
  },

  methods: {
    trigger (immediately) {
      if (immediately === true || this.debounce === 0 || this.debounce === '0') {
        this.__onResize()
      }
      else if (!this.timer) {
        this.timer = setTimeout(this.__onResize, this.debounce)
      }
    },

    __onResize () {
      this.timer = null

      if (!this.$el || !this.$el.parentNode) {
        return
      }

      const
        parent = this.$el.parentNode,
        size = {
          width: parent.offsetWidth,
          height: parent.offsetHeight
        }

      if (size.width === this.size.width && size.height === this.size.height) {
        return
      }

      this.size = size
      this.$emit('resize', this.size)
    }
  },

  render (h) {
    if (this.hasObserver === true) {
      return
    }

    return h('object', {
      style: this.style,
      attrs: {
        tabindex: -1, // fix for Firefox
        type: 'text/html',
        data: this.url,
        'aria-hidden': true
      },
      on: {
        load: () => {
          this.$el.contentDocument.defaultView.addEventListener('resize', this.trigger, listenOpts.passive)
          this.trigger(true)
        }
      }
    })
  },

  beforeCreate () {
    this.size = { width: -1, height: -1 }
    // if (isSSR === true) { return }

    this.hasObserver = typeof ResizeObserver !== 'undefined'

    if (this.hasObserver !== true) {
      this.style = `display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;`
    }
  },

  mounted () {
    if (this.hasObserver === true) {
      this.observer = new ResizeObserver(this.trigger)
      this.observer.observe(this.$el.parentNode)
      return
    }

    this.trigger(true)
  },

  beforeDestroy () {
    clearTimeout(this.timer)

    if (this.hasObserver === true) {
      this.$el.parentNode && this.observer.unobserve(this.$el.parentNode)
      return
    }

    if (this.$el.contentDocument) {
      this.$el.contentDocument.defaultView.removeEventListener('resize', this.trigger, listenOpts.passive)
    }
  }
}