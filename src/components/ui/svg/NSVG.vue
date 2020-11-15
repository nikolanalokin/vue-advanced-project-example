<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :style="styles"
    class="n-svg is-svg"
    :class="classes"
    v-html="inner"
    :viewBox="viewBox"></svg>
</template>

<script>

// import icons from './icons.json'
// import pictures from './pictures.json'

import { icons, pictures } from './data'

export default {
  name: 'NSVG',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    },
    type: {
      type: String,
      default: 'icon'
    },
    size: {
      type: [Number, String],
      default: 24,
    },
    color: {
      type: [String, Boolean],
      default: false
    },
    left: Boolean,
    right: Boolean,
  },
  computed: {
    styles () {
      return {
        height: typeof this.size == 'string' ? this.size : `${this.size}px`,
        width: typeof this.size == 'string' ? this.size : `${this.size}px`
      }
    },
    classes () {
      return {
        [`text-${this.color}`]: this.color,
        'on-left': this.left,
        'on-right': this.right,
      }
    },
    objects () {
      if (this.type === 'icon') return icons
      if (this.type === 'picture') return pictures
    },
    isObject () {
      return typeof this.objects[this.name] == 'object'
    },
    inner () {
      if (this.type === 'icon') return this.objects[this.name]
      if (this.type === 'picture') {
        if (this.isObject) {
          return this.objects[this.name].inner
        } else {
          return this.objects[this.name]
        }
      }
    },
    viewBox () {
      if (this.type === 'icon') return '0 0 30 30'
      if (this.type === 'picture') {
        if (this.isObject) {
          return this.objects[this.name].viewbox
        } else {
          return '0 0 50 50'
        }
      }
    }
  },
}

</script>