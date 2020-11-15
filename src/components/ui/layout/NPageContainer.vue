<template>

  <main class="n-page-container" :style="styleObj">
    <slot></slot>
  </main>

</template>

<script>

export default {
  name: 'NPageContainer',

  inject: {
    layout: {
      default () {
        console.error('NPageContainer needs to be child of NLayout')
      }
    }
  },

  provide: {
    pageContainer: true
  },

  computed: {
    styleObj () {
      const css = {}

      if (this.layout.header.space === true) {
        css.paddingTop = `${this.layout.header.size}px`
      }
      if (this.layout.footer.space === true) {
        css.paddingBottom = `${this.layout.footer.size}px`
      }
      if (this.layout.scrollWidth > 0) {
        css.marginRight = `${-this.layout.scrollWidth}px`
      }

      return css
    }
  },

  created () {
    
  },
}

</script>