<script>

import NLinkWrap from '../link/NLinkWrap.vue'
import slot from '../../../utils/slot'

export default {
  name: 'NCard',

  props: {
    to: null,
    dark: Boolean,

    square: Boolean,
    flat: Boolean,
    bordered: Boolean,
    block: Boolean
  },

  render (h) {
    return h(NLinkWrap, {
      props: {
        to: this.to
      },
      staticClass: 'n-card',
      class: {
        'n-card--dark': this.dark,
        'n-card--bordered': this.bordered,
        'n-card--square no-border-radius': this.square,
        'n-card--flat no-shadow': this.flat,
        'n-card--block': this.block
      },
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

/*   name: 'NCard',
  props: {
    to: null,
    width: Number,
    simple: Boolean
  },
  computed: {
    styleObj () {
      return {
        width: this.width ? `${this.width}px` : '',
      }
    },
    classObj () {
      return {
        'is-simple': this.simple,
      }
    },
  }, */
</script>
