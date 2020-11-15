<script>

import AlignMixin from '../../../mixins/align'
import slot from '../../../utils/slot'

export default {
  name: 'NCardActions',

  mixins: [ AlignMixin ],

  props: {
    vertical: Boolean
  },

  computed: {
    classes () {
      return `n-card__actions--${this.vertical === true ? 'vert column justify-start' : 'horiz row ' + this.alignClass}`
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'n-card__actions',
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

</script>