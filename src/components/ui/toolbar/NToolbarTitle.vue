<script>

import slot from '../../../utils/slot'

export default {
  name: 'NToolbarTitle',

  props: {
    shrink: Boolean
  },

  render (h) {
    return h('div', {
      staticClass: 'n-toolbar__title ellipsis',
      class: this.shrink === true ? 'col-shrink' : null,
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

</script>