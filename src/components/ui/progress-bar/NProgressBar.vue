<template>

  <div class="progress-bar" :class="classObj">
    <div class="progress-bar__line" :style="pStyleObj"></div>
  </div>

</template>

<script>

export default {
  name: 'NProgressBar',
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    rounded: Boolean,
    color: {
      type: String,
      default: 'dark'
    }
  },
  computed: {
    classObj () {
      return {
        'is-rounded': this.rounded,
        [`text-${this.color}`]: this.color
      }
    },
    pStyleObj () {
      return {
        width: `${this.value * 100 / (this.max - this.min)}%`
      }
    }
  }
}

</script>