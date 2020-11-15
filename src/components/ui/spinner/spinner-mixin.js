export default {
  props: {
    color: String,
    size: {
      type: [Number, String],
      default: '1em'
    },
    show: {
      type: Boolean,
      default: true
    },
  },

  computed: {
    classes () {
      if (this.color) {
        return `text-${this.color}`
      }
    }
  }
}
