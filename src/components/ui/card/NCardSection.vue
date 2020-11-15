<script>

import slot from '../../../utils/slot'

export default {
  name: 'NCardSection',

  render (h) {
    return h('div', {
      staticClass: 'n-card__section',
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

</script>