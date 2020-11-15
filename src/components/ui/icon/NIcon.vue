<template>
  <div class="n-icon" :class="classes" :style="styleObj" v-on="$listeners">
    <slot />
  </div>
  <!-- <svg v-else class="icon" :class="[colorClass, circleClass]" :style="styleObj" :viewBox="viewBox" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg> -->
</template>

<script>

export default {
  name: 'NIcon',
  props: {
    name: {
      type: String,
      default: '',
      required: true
    },
    size: {
      type: [Number, String],
      default: '',
    },
    left: Boolean,
    right: Boolean,
    color: String,
  },
  computed: {
    styleObj () {
      return {
        'font-size': typeof this.size == 'string' ? this.size : `${this.size}px`,
      }
    },
    classes () {
      let name = `lo ${this.name}`

      const commonCls = 
        (this.left === true ? ' on-left' : '') +
        (this.right === true ? ' on-right' : '')

      return name + commonCls + (this.color !== void 0 ? ` text-${this.color}` : '')
    }
  }
}

</script>