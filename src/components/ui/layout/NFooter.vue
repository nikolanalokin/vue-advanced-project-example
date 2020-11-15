<template>

  <footer class="n-footer fixed-bottom">
    <NResizeObserver @resize="__onResize" />
    <slot />
  </footer>

</template>

<script>

export default  {
  name: 'NFooter',

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

  data() {
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
      const offset = this.size - this.layout.scroll.position
      return offset > 0 ? offset : 0
    },
  },

  methods: {
    __onResize ({ height }) {
      this.__updateLocal('size', height)
      this.__update('size', height)
    },

    __update (prop, val) {
      if (this.layout.footer[prop] !== val) {
        this.layout.footer[prop] = val
      }
    },

    __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val
      }
    },
  },

  created () {
    this.layout.instances.footer = this
    this.__update('space', this.value)
    this.__update('offset', this.offset)
  },

  beforeDestroy () {
    if (this.layout.instances.footer === this) {
      this.layout.instances.footer = void 0
      this.__update('size', 0)
      this.__update('offset', 0)
      this.__update('space', false)
    }
  },
}

</script>