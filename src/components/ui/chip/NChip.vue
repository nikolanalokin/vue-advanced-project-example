<script>

import NLinkWrap from '../link/NLinkWrap.vue'
import NIcon from '../icon/NIcon.vue'
import { stopAndPrevent } from '../../../utils/event'
import slot from '../../../utils/slot'

export default {
  name: 'NChip',
  props: {
    to: [Object,String],

    dense: Boolean,

    icon: String,
    iconRight: String,
    label: [String, Number],

    color: String,
    textColor: String,

    value: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Boolean,
      default: null
    },

    square: Boolean,

    clickable: Boolean,
    removable: Boolean,

    tabindex: [String, Number],
    disable: Boolean
  },
  data () {
    return {

    }
  },
  computed: {
    classObj () {
      const text = this.outline
        ? this.color || this.textColor
        : this.textColor

      return {
        [`text-${text} n-chip_colored`]: text,
        disabled: this.disable,
        'n-chip_dense': this.dense,
        'n-chip_selected': this.selected,
        'n-chip_clickable cursor-pointer non-selectable n-hoverable': this.isClickable,
        'n-chip--square': this.square
      }
    },

    hasLeftIcon () {
      return this.selected === true || this.icon !== void 0
    },

    isClickable () {
      return this.disable === false && (this.clickable === true || this.selected !== null) || !!this.to
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    }
  },
  methods: {
    __onKeyup (e) {
      e.keyCode === 13 /* ENTER */ && this.__onClick(e)
    },

    __onClick (e) {
      if (!this.disable) {
        this.$emit('update:selected', !this.selected)
        this.$emit('click', e)
      }
    },

    __onRemove (e) {
      if (e.keyCode === void 0 || e.keyCode === 13) {
        stopAndPrevent(e)
        !this.disable && this.$emit('remove', false)
      }
    },

    __getContent (h) {
      const child = []

      this.isClickable && child.push(
        h('div', { staticClass: 'n-focus-helper' })
      )

      this.hasLeftIcon && child.push(
        h(NIcon, {
          staticClass: 'n-chip__icon n-chip__icon_left',
          props: { name: this.selected === true ? 'check' : this.icon }
        })
      )

      child.push(
        h('div', {
          staticClass: 'n-chip__content row no-wrap items-center n-anchor_skip'
        }, this.label !== void 0 ? [ this.label ] : slot(this, 'default'))
      )

      this.iconRight && child.push(
        h(NIcon, {
          staticClass: 'n-chip__icon n-chip__icon_right',
          props: { name: this.iconRight }
        })
      )

      this.removable && child.push(
        h(NIcon, {
          staticClass: 'n-chip__icon n-chip__icon_remove cursor-pointer',
          props: { name: 'close' },
          attrs: { tabindex: this.computedTabindex },
          nativeOn: {
            click: this.__onRemove,
            keyup: this.__onRemove
          }
        })
      )

      return child
    }
  },

  render (h) {
    if (!this.value) { return }

    const data = this.isClickable ? {
      attrs: { tabindex: this.computedTabindex },
      on: {
        click: this.__onClick,
        keyup: this.__onKeyup
      },
      props: {
        to: this.to
      }
    } : {}

    data.staticClass = 'n-chip row inline no-wrap items-center'
    data.class = this.classObj

    return h(NLinkWrap, data, this.__getContent(h))
  }
}

</script>