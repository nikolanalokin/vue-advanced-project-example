<script>

import CheckboxMixin from '../../../mixins/checkbox'

export default  {
  name: 'NSwitch',
  mixins: [ CheckboxMixin ],
  props: {
    tag: {
      type: String,
      default: 'label'
    },
    row: Boolean,
  },
  computed: {
    classObj () {
      return { 
        'is-checked': this.value,
        disabled: this.disable,
        'is-row': this.row
      }
    }
  },

  render (h) {
    return h(this.tag, {
      staticClass: 'n-switch',
      class: this.classObj,
      on: {
        click: this.toggle,
        // keydown: this.__keyDown
      }
    }, [
      !!this.label
        ? h('span', {
          staticClass: 'n-switch__label'
        }, this.label)
        : null,
      !this.disable
        ? h('input', {
          staticClass: 'n-switch__native ma-none pa-none invisible',
          attrs: { type: 'checkbox' },
          on: { change: this.toggle }
        })
        : null,
      h('span', {
        staticClass: 'n-switch__handle'
      })
    ])
  }
}

</script>