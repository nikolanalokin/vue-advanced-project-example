<script>

import { stopAndPrevent } from '../../../utils/event'
import slot from '../../../utils/slot'

export default {
  name: 'NRadio',

  props: {
    value: {
      required: true
    },
    val: {
      required: true
    },

    label: String,
    leftLabel: Boolean,

    color: String,
    keepColor: Boolean,
    dark: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number]
  },

  computed: {
    isTrue () {
      return this.value === this.val
    },

    classes () {
      return {
        'disabled': this.disable,
        'n-radio--dark': this.dark,
        'n-radio--dense': this.dense,
        'reverse': this.leftLabel
      }
    },

    innerClass () {
      if (this.isTrue === true) {
        return 'n-radio__inner--active' +
          (this.color !== void 0 ? ' text-' + this.color : '')
      }
      else if (this.keepColor === true && this.color !== void 0) {
        return 'text-' + this.color
      }
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    }
  },

  methods: {
    set (e) {
      e !== void 0 && stopAndPrevent(e)
      if (this.disable !== true && this.isTrue !== true) {
        this.$emit('input', this.val)
      }
    },

    __keyDown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.set(e)
      }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'n-radio cursor-pointer no-outline row inline no-wrap items-center',
      class: this.classes,
      attrs: { tabindex: this.computedTabindex },
      on: {
        click: this.set,
        keydown: this.__keyDown
      }
    }, [
      h('div', {
        staticClass: 'n-radio__inner relative-position',
        class: this.innerClass
      }, [
        this.disable !== true
          ? h('input', {
            staticClass: 'n-radio__native n-ma-none n-pa-none invisible',
            attrs: { type: 'checkbox' },
            on: { change: this.set }
          })
          : null,

        h('div', {
          staticClass: 'n-radio__bg absolute'
        }, [
          h('div', { staticClass: 'n-radio__outer-circle absolute-full' }),
          h('div', { staticClass: 'n-radio__inner-circle absolute-full' })
        ])
      ]),

      this.label !== void 0 || this.$scopedSlots.default !== void 0
        ? h('div', {
          staticClass: 'n-radio__label n-anchor--skip'
        }, (this.label !== void 0 ? [ this.label ] : []).concat(slot(this, 'default')))
        : null
    ])
  }
}

</script>