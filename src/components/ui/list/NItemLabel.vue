<script>

import slot from '../../../utils/slot'

export default {
  name: 'NItemLabel',

  props: {
    overline: Boolean,
    caption: Boolean,
    header: Boolean,
    primary: Boolean,
    secondary: Boolean,
    tertiary: Boolean,
    lines: [Number, String]
  },

  computed: {
    classes () {
      return {
        'n-item__label--overline text-overline': this.overline,
        'n-item__label--caption text-caption': this.caption,
        'n-item__label--header': this.header,
        'n-item__label--primary': this.primary,
        'n-item__label--secondary': this.secondary,
        'n-item__label--tertiary': this.tertiary,
        'ellipsis': parseInt(this.lines, 10) === 1
      }
    },

    style () {
      if (this.lines !== void 0 && parseInt(this.lines, 10) > 1) {
        return {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': this.lines
        }
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'n-item__label',
      style: this.style,
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

</script>