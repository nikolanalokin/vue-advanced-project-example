<script>

import { RouterLinkMixin } from '../../../mixins/router-link'
import slot from '../../../utils/slot'
import { stopAndPrevent } from '../../../utils/event'

export default {
  name: 'NItem',

  mixins: [ RouterLinkMixin ],

  props: {
    active: Boolean,
    dark: Boolean,

    clickable: Boolean,
    dense: Boolean,
    insetLevel: Number,

    tabindex: [String, Number],
    tag: {
      type: String,
      default: 'div'
    },

    focused: Boolean,
    manualFocus: Boolean
  },

  computed: {
    isClickable () {
      return this.disable !== true && (
        this.clickable === true ||
        this.hasRouterLink === true ||
        this.tag === 'a' ||
        this.tag === 'label'
      )
    },

    classes () {
      return {
        'n-item--clickable n-link cursor-pointer': this.isClickable,
        'n-focusable n-hoverable': this.isClickable === true && this.manualFocus === false,

        'n-manual-focusable': this.isClickable === true && this.manualFocus === true,
        'n-manual-focusable--focused': this.isClickable === true && this.focused === true,

        'n-item--dense': this.dense,
        'n-item--dark theme_dark': this.dark,
        'n-item--active': this.active,
        [this.activeClass]: this.active === true && this.hasRouterLink !== true && this.activeClass !== void 0,

        'disabled': this.disable
      }
    },

    style () {
      if (this.insetLevel !== void 0) {
        return {
          paddingLeft: (16 + this.insetLevel * 56) + 'px'
        }
      }
    }
  },

  methods: {
    __getContent (h) {
      const child = [].concat(slot(this, 'default'))
      this.isClickable === true && child.unshift(h('div', { staticClass: 'n-focus-helper', attrs: { tabindex: -1 }, ref: 'blurTarget' }))
      return child
    },

    __onClick (e) {
      if (this.isClickable === true) {
        if (e.qKeyEvent !== true && this.$refs.blurTarget !== void 0) {
          this.$refs.blurTarget.focus()
        }

        this.$emit('click', e)
      }
    },

    __onKeyup (e) {
      if (e.keyCode === 13 && this.isClickable === true) {
        stopAndPrevent(e)

        // for ripple
        e.qKeyEvent = true

        // for click trigger
        const evt = new MouseEvent('click', e)
        evt.qKeyEvent = true
        this.$el.dispatchEvent(evt)
      }

      this.$emit('keyup', e)
    }
  },

  render (h) {
    const data = {
      staticClass: 'n-item n-item-type row no-wrap',
      class: this.classes,
      style: this.style
    }

    const evtProp = this.hasRouterLink === true ? 'nativeOn' : 'on'
    data[evtProp] = {
      ...this.$listeners,
      click: this.__onClick,
      keyup: this.__onKeyup
    }

    if (this.isClickable === true) {
      data.attrs = {
        tabindex: this.tabindex || '0'
      }
    }

    if (this.hasRouterLink === true) {
      data.tag = 'a'
      data.props = this.routerLinkProps

      return h('router-link', data, this.__getContent(h))
    }

    return h(
      this.tag,
      data,
      this.__getContent(h)
    )
  }
}

</script>