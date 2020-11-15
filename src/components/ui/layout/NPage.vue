<template>

  <div class="n-page" :class="{ loading: this.loading }" :style="styleObj">
    <NLoader v-if="loading"/>
    <slot v-else />
  </div>

</template>

<script>

export default {
  name: 'NPage',

  inject: {
    pageContainer: {
      default () {
        console.error('NPage needs to be child of NPageContainer')
      }
    },
    layout: {}
  },

  props: {
    styleFn: Function,
    loading: Boolean
  },
  
  computed: {
    styleObj () {
      const offset =
        (this.layout.header.space === true ? this.layout.header.size : 0) +
        (this.layout.footer.space === true ? this.layout.footer.size : 0)

      if (typeof this.styleFn === 'function') {
        return this.styleFn(offset)
      }

      const minHeight = this.layout.container === true
        ? (this.layout.containerHeight - offset) + 'px'
        : (offset !== 0 ? `calc(100vh - ${offset}px)` : `100vh`)

      return { minHeight }
    },
  },
  
}

</script>