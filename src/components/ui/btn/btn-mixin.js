import AlignMixin from '../../../mixins/align'

const sizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

export default {
  mixins: [ AlignMixin ],

  props: {
    type: String,
    to: [Object, String],
    replace: Boolean,

    label: [Number, String],
    icon: String,
    iconRight: String,

    round: Boolean,
    outline: Boolean,
    flat: Boolean,

    size: String,

    color: String,
    textColor: String,
    noWrap: Boolean,
    dense: Boolean,

    tabindex: [Number, String],

    align: { default: 'center' },
    stack: Boolean,
    stretch: Boolean,
    loading: {
      type: Boolean,
      default: null
    },
    disable: Boolean
  },

  computed: {
    style () {
      if (this.size) {
        return {
          fontSize: this.size in sizes ? `${sizes[this.size]}px` : this.size,
        }
      }
    },

    isRound () {
      return this.round === true
    },

    isDisabled () {
      return this.disable === true || this.loading === true
    },

    computedTabIndex () {
      return this.isDisabled === true ? -1 : this.tabindex || 0
    },

    hasRouterLink () {
      return this.disable !== true && this.to !== void 0 && this.to !== null && this.to !== ''
    },

    isLink () {
      return this.type === 'a' || this.hasRouterLink === true
    },

    design () {
      if (this.flat === true) return 'flat'
      if (this.outline === true) return 'outline'
      return 'standard'
    },

    attrs () {
      const att = { tabindex: this.computedTabIndex }
      if (this.type !== 'a') {
        att.type = this.type || 'button'
      }
      /* if (this.hasRouterLink === true) {
        att.href = this.$router.resolve(this.to).href
      } */
      if (this.isDisabled === true) {
        att.disabled = true
      }
      return att
    },

    classes () {
      let colors

      if (this.color !== void 0) {
        if (this.flat === true || this.outline === true) {
          colors = `text-${this.textColor || this.color}`
        }
        else {
          colors = `bg-${this.color} text-${this.textColor || 'white'}`
        }
      }
      else if (this.textColor) {
        colors = `text-${this.textColor}`
      }

      return `n-btn--${this.design} n-btn--${this.isRound === true ? 'round' : 'rectangle'}` +
        (colors !== void 0 ? ' ' + colors : '') +
        (this.isDisabled !== true ? ' n-focusable n-hoverable' : ' disabled') +
        (this.dense === true ? ' n-btn--dense' : '')
    },

    innerClasses () {
      return this.alignClass + (this.stack === true ? ' column' : ' row') +
        (this.noWrap === true ? ' no-wrap text-no-wrap' : '') +
        (this.loading === true ? ' n-btn__content--hidden' : '')
    }
  }
}
