
<script>

import slot from '../../../utils/slot'

export default {
  name: 'NPageSticky',

  inject: {
    layout: {
      default () {
        console.error('NPageSticky needs to be child of NLayout')
      }
    }
  },

  props: {
    position: {
      type: String,
      default: 'bottom-right',
      validator: v => [
        'top-right', 'top-left',
        'bottom-right', 'bottom-left',
        'top', 'right', 'bottom', 'left'
      ].includes(v)
    },
    offset: {
      type: Array,
      validator: v => v.length === 2
    },
    expand: Boolean
  },

  computed: {
    attach () {
      const pos = this.position

      return {
        top: pos.indexOf('top') > -1,
        right: pos.indexOf('right') > -1,
        bottom: pos.indexOf('bottom') > -1,
        left: pos.indexOf('left') > -1,
        vertical: pos === 'top' || pos === 'bottom',
        horizontal: pos === 'left' || pos === 'right'
      }
    },

    top () {
      return this.layout.header.offset
    },

    bottom () {
      return this.layout.footer.offset
    },

    style () {
      let
        posX = 0,
        posY = 0

      const attach = this.attach

      if (attach.top === true && this.top !== 0) {
        posY = `${this.top}px`
      }
      else if (attach.bottom === true && this.bottom !== 0) {
        posY = `${-this.bottom}px`
      }

      if (attach.left === true && this.left !== 0) {
        posX = `${this.left}px`
      }
      else if (attach.right === true && this.right !== 0) {
        posX = `${this.right}px`
      }

      const css = { transform: `translate(${posX}, ${posY})` }

      if (this.offset) {
        css.margin = `${this.offset[1]}px ${this.offset[0]}px`
      }

      if (attach.horizontal === true) {
        if (this.top !== 0) {
          css.top = `${this.top}px`
        }
        if (this.bottom !== 0) {
          css.bottom = `${this.bottom}px`
        }
      }

      if (this.layout.scrollWidth > 0) {
        css.marginRight = `${-this.layout.scrollWidth}px`
      }

      return css
    },

    classes () {
      return `fixed-${this.position} n-page-sticky--${this.expand === true ? 'expand' : 'shrink'}`
    }
  },

  render (h) {
    const content = slot(this, 'default')

    return h('div', {
      staticClass: 'n-page-sticky n-layout__section--animate row flex-center',
      class: this.classes,
      style: this.style
    },
    this.expand === true
      ? content
      : [ h('div', content) ]
    )
  }
}

</script>