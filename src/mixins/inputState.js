export default {
  props: {
    state: {
      type: String,
      default: ''
    },
  },
  computed: {
    stateClasses: function () {
      return {
        'is-error': this.state == 'error',
        'is-success': this.state == 'success',
        'is-warning': this.state == 'warning',
      }
    },
  }
}