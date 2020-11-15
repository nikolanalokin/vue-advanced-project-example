export default {
  props: {
    value: Boolean
  },

  data () {
    return {
      showing: false
    }
  },

  watch: {
    value (val) {
      if (this.disable === true && val === true) {
        this.$emit('input', false)
        return
      }

      if (val !== this.showing) {
        this[val ? 'show' : 'hide']()
      }
    }
  },

  methods: {
    toggle (evt) {
      this[this.showing === true ? 'hide' : 'show'](evt)
    },

    show (evt) {
      if (this.disable === true || this.showing === true) {
        return
      }
      if (this.__showCondition !== void 0 && this.__showCondition(evt) !== true) {
        return
      }

      this.$emit('before-show', evt)
      this.showing = true
      this.$emit('input', true)

      if (this.__show !== void 0) {
        this.__show(evt)
      }
      else {
        this.$emit('show', evt)
      }
    },

    hide (evt) {
      if (this.disable === true || this.showing === false || this.noHide === true) {
        return
      }

      this.$emit('before-hide', evt)
      this.showing = false
      this.value !== false && this.$emit('input', false)

      if (this.__hide !== void 0) {
        this.__hide(evt)
      }
      else {
        this.$emit('hide', evt)
      }
    },
  },
}
