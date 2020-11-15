<template>

  <header class="n-header fixed-top" :style="styleObj">
    <NResizeObserver @resize="__onResize" />
    <slot />
  </header>

</template>

<script>

export default {
  name: 'NHeader',

  inject: {
    layout: {
      default () {
        console.error('NHeader needs to be child of NLayout')
      }
    }
  },

  props: {
    value: {
      type: Boolean,
      default: true
    },
  },

  data () {
    return {
      size: 0,
    }
  },

  watch: {
    value (val) {
      this.__update('space', val)
    },

    offset (val) {
      this.__update('offset', val)
    },
  },

  computed: {
    offset () {
      if (this.value !== true) {
        return 0
      }
      const offset = this.size /* - this.layout.scroll.position */
      return offset > 0 ? offset : 0
    },
    styleObj () {
      const css = {}

      if (this.layout.scrollWidth > 0) {
        css.marginRight = `${-this.layout.scrollWidth}px`
      }

      return css
    }
  },

  methods: {
    __onResize ({ height }) {
      this.__updateLocal('size', height)
      this.__update('size', height)
    },

    __update (prop, val) {
      if (this.layout.header[prop] !== val) {
        this.layout.header[prop] = val
      }
    },

    __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val
      }
    },
  },

  created () {
    this.layout.instances.header = this
    this.__update('space', this.value)
    this.__update('offset', this.offset)
  },

  beforeDestroy () {
    if (this.layout.instances.header === this) {
      this.layout.instances.header = void 0
      this.__update('size', 0)
      this.__update('offset', 0)
      this.__update('space', false)
    }
  },
}

</script>