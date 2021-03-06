import { stopAndPrevent } from '../utils/event'

export default {
  props: {
    value: {
      required: true
    },
    val: {},

    trueValue: { default: true },
    falseValue: { default: false },

    label: String,
    leftLabel: Boolean,

    color: String,
    keepColor: Boolean,
    dark: Boolean,
    dense: Boolean,

    disable: Boolean,
    tabindex: [String, Number],

    compareBy: String
  },

  computed: {
    isTrue () {
      return this.modelIsArray
        ? this.index > -1
        : this.value === this.trueValue
    },

    isFalse () {
      return this.modelIsArray
        ? this.index === -1
        : this.value === this.falseValue
    },

    index () {
      if (this.modelIsArray === true) {
        return !!this.compareBy ? this.value.findIndex(v => v[this.compareBy] == this.val[this.compareBy]) : this.value.indexOf(this.val) // this.value.indexOf(this.val)
      }
    },

    modelIsArray () {
      return Array.isArray(this.value)
    },

    computedTabindex () {
      return this.disable === true ? -1 : this.tabindex || 0
    }
  },

  methods: {
    toggle (e) {
      e !== void 0 && stopAndPrevent(e)

      if (this.disable === true) {
        return
      }

      let val

      if (this.modelIsArray === true) {
        if (this.isTrue === true) {
          val = this.value.slice()
          val.splice(this.index, 1)
        }
        else {
          val = this.value.concat(this.val)
        }
      }
      else if (this.isTrue === true) {
        val = this.toggleIndeterminate ? this.indeterminateValue : this.falseValue
      }
      else if (this.isFalse === true) {
        val = this.trueValue
      }
      else {
        val = this.falseValue
      }

      this.$emit('input', val)
    },

    __keyDown (e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.toggle(e)
      }
    }
  }
}
