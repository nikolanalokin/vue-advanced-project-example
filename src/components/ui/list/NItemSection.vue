<script>

import slot from '../../../utils/slot'

export default {
  name: 'NItemSection',

  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },

  computed: {
    classes () {
      const side = this.avatar || this.side || this.thumbnail

      return {
        'n-item__section--top': this.top,
        'n-item__section--avatar': this.avatar,
        'n-item__section--thumbnail': this.thumbnail,
        'n-item__section--side': side,
        'n-item__section--nowrap': this.noWrap,
        'n-item__section--main': !side,
        [`justify-${this.top ? 'start' : 'center'}`]: true
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'n-item__section column',
      class: this.classes,
      on: this.$listeners
    }, slot(this, 'default'))
  }
}

</script>