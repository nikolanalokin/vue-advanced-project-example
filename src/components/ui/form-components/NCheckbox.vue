<script>

import CheckboxMixin from '../../../mixins/checkbox'
import slot from '../../../utils/slot'

export default  {
  name: 'NCheckbox',

  mixins: [ CheckboxMixin ],

  props: {
    toggleIndeterminate: Boolean,
    indeterminateValue: { default: null }
  },
  
  computed: {
    isIndeterminate () {
      return this.value === void 0 || this.value === this.indeterminateValue
    },
    classes () {
      return {
        'disabled': this.disable,
        'n-checkbox--dark': this.dark,
        'n-checkbox--dense': this.dense,
        'reverse': this.leftLabel
      }
    },
    innerClass () {
      if (this.isTrue === true) {
        return 'n-checkbox__inner--active' +
          (this.color !== void 0 ? ' text-' + this.color : '')
      }
      else if (this.isIndeterminate === true) {
        return 'n-checkbox__inner--indeterminate' +
          (this.color !== void 0 ? ' text-' + this.color : '')
      }
      else if (this.keepColor === true && this.color !== void 0) {
        return 'text-' + this.color
      }
    }
    /* classObj () {
      return { 
        'is-checked': this.mutableValue,
        disabled: this.disable,
      }
    } */
  },

  render (h) {
    return h('div', {
      staticClass: 'n-checkbox cursor-pointer no-outline row inline no-wrap items-center',
      class: this.classes,
      attrs: { tabindex: this.computedTabindex },
      on: {
        click: this.toggle,
        keydown: this.__keyDown
      }
    }, [
      h('div', {
        staticClass: 'n-checkbox__inner relative-position',
        class: this.innerClass
      }, [
        this.disable !== true
          ? h('input', {
            staticClass: 'n-checkbox__native ma-none pa-none invisible',
            attrs: { type: 'checkbox' },
            on: { change: this.toggle }
          })
          : null,

        h('div', {
          staticClass: 'n-checkbox__bg absolute'
        }, [
          h('svg', {
            staticClass: 'n-checkbox__check fit absolute-full',
            attrs: { viewBox: '0 0 24 24' }
          }, [
            h('path', {
              attrs: {
                fill: 'none',
                d: 'M3,12.8L8.4,18L21,6'
              }
            })
          ]),

          h('div', { staticClass: 'n-checkbox__check-indet absolute' })
        ])
      ]),

      this.label !== void 0 || this.$scopedSlots.default !== void 0
        ? h('div', {
          staticClass: 'n-checkbox__label n-anchor--skip'
        }, (this.label !== void 0 ? [ this.label ] : []).concat(slot(this, 'default')))
        : null
    ])
  }
}

</script>