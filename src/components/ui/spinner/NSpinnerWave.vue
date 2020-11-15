<script>

import mixin from './spinner-mixin'

export default {
  name: 'NSpinnerWave',
  
  mixins: [mixin],

  render (h) {
    return this.show ? h('svg', {
      staticClass: 'q-spinner',
      class: this.classes,
      on: this.$listeners,
      attrs: {
        'stroke': 'currentColor',
        'width': this.size,
        'height': this.size,
        'viewBox': '5 0 80 60',
        'xmlns': 'http://www.w3.org/2000/svg'
      }
    }, [
      h('path', {
        attrs: {
          'id': 'wave',
          'fill': 'none',
          'stroke-width': '4',
          'stroke-linecap': 'round',
          'd': 'M 0 37.5 c 7.684299348848887 0 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15',
        }
      })
    ]) : void 0
  }
}
</script>

<style lang="scss">

#wave {
  stroke-dasharray: 0 16 101 16;
  animation: moveTheWave 2400ms linear infinite;
}

@keyframes moveTheWave {
  0% {
    stroke-dashoffset: 0;
    transform: translate3d(0, 0, 0);
  }
  100% {
    stroke-dashoffset: -133;
    transform: translate3d(-90px, 0, 0);
  }
}

</style>
