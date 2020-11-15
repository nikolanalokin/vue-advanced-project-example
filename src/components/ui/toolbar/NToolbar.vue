<script>

import slot from '../../../utils/slot'

export default {
  name: 'NToolbar',

  render (h) {
    return h('div', {
      staticClass: 'n-toolbar row no-wrap items-center',
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

</script>