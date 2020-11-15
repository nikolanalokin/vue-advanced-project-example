<script>

export default {
  name: 'NDivider',
  props: {
    indent: Boolean,
    left: [Number,String],
    right: [Number,String],
  },
  computed: {
    classObj () {
      return {
        'has-indent': this.indent
      }
    },
    styleObj () {
      return {
        'margin-left': this.left ? `${this.left}px` : '',
        'margin-right': this.right ? `${this.right}px` : ''
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'n-divider',
      class: this.classObj,
      style: this.styleObj
    })
  }
}

</script>