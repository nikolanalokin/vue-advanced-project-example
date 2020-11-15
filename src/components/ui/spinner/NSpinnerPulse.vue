<template>
  <div id="pulse" :class="classes" :style="styleObj">
    <!-- <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div>
    <div class="ball"></div> -->
  </div>
</template>

<script>

import mixin from './spinner-mixin'

export default {
  name: 'NSpinnerPulse',
  
  mixins: [mixin],

  computed: {
    styleObj () {
      return {
        'width': this.size,
        'height': this.size,
        'line-height': this.size,
      }
    }
  },
}

</script>

<style lang="scss">

// #pulse {
//   position: relative;

//   .ball {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     border-radius: 50%;
//     background: currentColor;
//     opacity: .25;
//     animation: jelly 2.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;

//     @for $i from 2 through 4 {
//       &:nth-child(#{$i}) {
//         z-index: -$i;
//         transform: scale(1 + ($i - 1) * 0.4);
//         animation: jelly#{$i} 2.5s (($i - 1) * 0.2s) cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
//       }
//     }
//   }
// }

// @keyframes jelly {
//   0% {
//     transform: scale(1);
//   }

//   50% {
//     transform: scale(.6);
//   }

//   100% {
//     transform: scale(1);
//   }
// }

// @keyframes jelly2 {
//   0% {
//     transform: scale(1.4);
//   }

//   45% {
//     transform: scale(1);
//   }

//   100% {
//     transform: scale(1.4);
//   }
// }

// @keyframes jelly3 {
//   0% {
//     transform: scale(1.8);
//   }

//   40% {
//     transform: scale(1.5);
//   }

//   100% {
//     transform: scale(1.8);
//   }
// }

// @keyframes jelly4 {
//   0% {
//     transform: scale(2.2);
//   }

//   35% {
//     transform: scale(1.9);
//   }

//   100% {
//     transform: scale(2.2);
//   }
// }
#pulse {
  position: relative;
  
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: currentColor;
    border-radius: 50%;
    opacity: 0;
  }
  
  &:before {
    transform: scale(1);
    animation: pulse 2s infinite linear;
  }
  
  &:after {
    animation: pulse 2s 1s infinite linear;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  33% {
    transform: scale(1);
    opacity: .7;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

</style>