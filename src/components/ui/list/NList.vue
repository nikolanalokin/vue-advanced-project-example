<script>

import slot from '../../../utils/slot'

export default {
  name: 'NList',

  props: {
    bordered: Boolean,
    dense: Boolean,
    separator: Boolean,
    dark: Boolean,
    padding: Boolean
  },

  computed: {
    classes () {
      return {
        'n-list--bordered': this.bordered,
        'n-list--dense': this.dense,
        'n-list--separator': this.separator,
        'n-list--dark theme_dark': this.dark,
        'n-list--padding': this.padding
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'n-list',
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

</script>