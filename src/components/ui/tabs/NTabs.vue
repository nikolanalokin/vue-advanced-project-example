<template>

  <nav class="n-tabs" 
    :class="classObj"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave">
    <NLinkWrap class="n-tabs__item gutter-x-sm"
      v-for="(item, index) in items"
      :class="{ 
        'is-disabled': item.disabled, 
        'is-active': isActive(item),
      }"
      :key="index"
      :to="item.to"
      @click="onClick(item)"
      :ref="routerMode ? item.to.name : item[cValue]">
      <span v-if="item[cLabel]">{{ item[cLabel] }}</span>
      <NSVG v-if="item[cIcon]" :name="item[cIcon]" :color="isActive(item) ? color : 'dark-s'" size="24" />
      <span class="n-tabs__counter" v-if="item.count">{{ item.count }}</span>
    </NLinkWrap>

    <div class="n-tabs__slider" v-show="curActiveEl" :class="color ? `bg-${color}` : void 0" :style="sliderStyleObj"></div>
  </nav>

</template>

<script>

export default  {
  name: 'NTabs',
  props: {
    value: null,
    items: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },

    optionValue: String,
    optionLabel: String,
    optionIcon: String,

    routerMode: Boolean,
    routeQueryValue: {
      type: String,
      default: 'section'
    },
    routerAction: {
      type: String,
      default: 'push',
      validator (value) {
        return value == 'replace' || value == 'push'
      }
    },
    align: {
      type: String,
      default: 'left',
      validator: v => ['left','right','center','justify'].includes(v)
    },

    color: String
  },
  data() {
    return {
      currentItem: null,
      innerValue: null,

      sliderLeft: 0,
      sliderWidth: 0,

      curActiveEl: null,
      curAnchorSliderEl: null
    }
  },
  watch: {
    items: {
      deep: true,
      handler (val) {
        this.updateSlider(this.curActiveEl, true)
      }
    },
    value (newVal, oldVal) {
      if (newVal != oldVal && this.items) {
        this.innerValue = this.value
      }
    },
    innerValue (val) {
      this.$nextTick(() => {
        this.curActiveEl = val !== void 0 && this.$refs[val] ? this.$refs[val][0].$el : null
        this.updateSlider(this.curActiveEl)
      })
    },
    '$route' (to, from) {
      if (this.routerMode) {
        let fromVal = from.name
          , toVal = to.name

        if (toVal == fromVal || this.innerValue == toVal) return
        
        this.innerValue = toVal
        this.emits(toVal)
        this.updateSlider(this.curActiveEl)
      }
    }
  },
  computed: {
    classObj () {
      return {
        [`align_${this.align}`]: this.align,
        [`text-${this.color}`]: this.color,
      }
    },
    cValue () { return this.optionLabel || 'value' },
    cLabel () { return this.optionValue || 'label' },
    cIcon () { return this.optionIcon || 'icon' },
    sliderStyleObj () {
      return {
        left: `${this.sliderLeft}px`,
        width: `${this.sliderWidth}px`,
      }
    }
  },
  methods: {
    isActive (item) {
      return this.routerMode ? this.innerValue == item.to.name : this.innerValue == item[this.cValue]
    },
    onMouseMove (e) {
      let activeEl = e.target.closest('.n-tabs__item')
      activeEl ? this.updateSlider(activeEl) : void 0
    },
    onMouseLeave () {
      this.updateSlider(this.curActiveEl)
    },
    emits () {
      this.$emit('input', this.innerValue)
    },
    updateSlider (anchorEl, required) {
      if (this.curAnchorSliderEl == anchorEl && !required || !anchorEl) return
      // console.dir(this.$refs, this.innerValue, this.$refs[this.innerValue]);
      this.$nextTick(() => {
        this.sliderLeft = anchorEl.offsetLeft
        this.sliderWidth = anchorEl.offsetWidth
      })
      this.curAnchorSliderEl = anchorEl
    },
    onClick (item) {
      if (this.disabled) return false

      if (!this.routerMode) {
        this.innerValue = this.routerMode ? item.to.name : item[this.cValue]
        this.emits()
        item.cb ? item.cb() : void 0
      }
    }
  },
  created () {
    if (this.routerMode) {
      let rn = this.$route.name
      if (rn) {
        this.innerValue = rn
        this.emits()
      }
    } else {
      if (this.value) this.innerValue = this.value
      else this.innerValue = ''
    }
  },
  mounted () {
    this.updateSlider(this.curActiveEl)
  }
}

</script>