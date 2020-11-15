<script>

import slot from '../../../utils/slot'

const sizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
}

export default  {
  name: 'NBtn',
  props: {
    type: String,
    nativeType: String,
    to: [Object, String],

    flat: Boolean,
    round: Boolean,
    rounded: Boolean,
    block: Boolean,
    dense: Boolean,
    hoverLabel: Boolean,
    size: String,

    label: [String,Number],
    icon: String,
    svg: Boolean,
    iconRight: String,
    hoverIcon: String,

    disabled: Boolean,
    loading: Boolean,

    multiple: Boolean,
    accept: String,
    onUpload: {
      type: Function,
      default: null
    },

    tabindex: [Number, String],
    color: String,
    textColor: String
  },
  data() {
    return {
      files: null,
      labelW: null,
      clicked: false,
      hovered: false
    }
  },
  methods: {
    onChange (e) {
      this.files = e.target.files || e.dataTransfer.files
      if (this.onUpload) this.onUpload(this.files)
      this.$emit('select-files', this.files)
    },
    focus () {
      this.$el.focus()
    },
    blur () {
      this.$el.blur()
    },
    onClick (e) {
      this.$emit('click', e)
      this.clicked = true
      this.timer = setTimeout(() => {
        this.clicked = false
        clearTimeout(this.timer)
      }, 400)
    },
    onMouseEnter () {
      this.hovered = true
    },
    onMouseLeave () {
      this.hovered = false
    }
  },
  computed: {
    classObj () {
      return {
        [`bg-${this.color} text-${this.textColor || 'white'}`]: this.color !== void 0 && !this.flat,
        [`text-${this.color}`]: this.color !== void 0 && this.flat,
        'is-disabled': this.disabled,
        'n-focusable n-hoverable': this.disabled !== true,
        'is-flat': this.flat,
        'is-round': this.round,
        'is-rounded': this.rounded,
        'is-dense': this.dense,
        'is-loading': this.loading,
        'is-hover-label': this.hoverLabel,
        'is-hovered': this.hovered,
        'has-label': this.hasLabel,
        'has-leading-icon': this.hasLabel && this.icon !== void 0,
        'has-trailing-icon': this.hasLabel && this.iconRight !== void 0,
        'full-width': this.block === true,
        'is-clicked': this.clicked
      }
    },
    
    styleObj () {
      return {
        fontSize: this.size ? this.size in sizes ? `${sizes[this.size]}px` : this.size : ''
      }
    },

    labelStyleObj () {
      let width = this.hovered ? this.labelW : 0
      return {
        maxWidth: this.hoverLabel && this.labelW ? `${width}px` : ''
      }
    },

    attrsObj () {
      let data = { tabindex: this.computedTabIndex }
      if (!this.isLink && !this.isFile) data.type = this.nativeType || 'button'
      if (this.isDisabled === true) data.disabled = true
      return data
    },

    isLink () {
      return this.type == 'a' || this.hasRouterLink
    },

    isFile () {
      return this.type == 'file'
    },

    hasRouterLink () {
      return this.disabled !== true && this.to !== void 0 && this.to !== null && this.to !== ''
    },

    isDisabled () {
      return this.disabled === true || this.loading === true
    },

    hasLabel () {
      return !!this.label
    },

    computedTabIndex () {
      return this.isDisabled === true ? -1 : this.tabindex || 0
    },
  },

  mounted () {
    this.labelW = this.$refs.label.offsetWidth
  },

  render (h) {
    let tag

    if (this.isLink) tag = 'router-link'
    else if (this.isFile) tag = 'label'
    else tag = 'button'
    
    let data = {
      staticClass: 'n-btn',
      class: this.classObj,
      style: this.styleObj,
      attrs: this.attrsObj,
    }

    if (this.isDisabled === false) {
      data.on = {
        ...this.$listeners,
        click: this.onClick,
        mouseenter: this.onMouseEnter,
        mouseleave: this.onMouseLeave,
        // keydown: this.__onKeydown,
        // keyup: this.__onKeyup
      }
    }

    if (this.isLink) {
      data.props = {
        to: this.to
      }
    }

    let svgSize = (this.size ? this.size in sizes ? sizes[this.size] : this.size : 14) * 1.7142858

    let inner = [
      slot(this, 'default'),

      this.icon !== void 0 || this.hoverIcon
        ? h(this.svg ? 'NSVG' : 'NIcon', {
          props: {
            name: this.hoverIcon && this.hovered ? this.hoverIcon : this.icon,
            left: this.hasLabel,
            size: this.svg ? svgSize : void 0,
            color: this.svg ? this.color : void 0
          }
        })
        : null,

      h('div', {
        staticClass: 'n-btn__label',
        ref: 'label',
        style: this.labelStyleObj,
      }, [ this.label || this.$scopedSlots.default ]),
      
      this.iconRight !== void 0
        ? h(this.svg ? 'NSVG' : 'NIcon', {
          props: {
            name: this.iconRight,
            right: this.hasLabel,
            size: this.svg ? svgSize : void 0,
            color: this.svg ? this.color : void 0
          }
        })
        : null
    ]

    return h(tag, data, [
      h('div', {
        staticClass: 'n-focus-helper',
        ref: 'blurTarget',
        attrs: { tabindex: -1 }
      }),
      
      h('div', {
        staticClass: 'n-btn__click-helper',
        class: `text-${this.color}`
      }),
      
      this.isFile !== void 0
        ? h('input', {
          staticClass: 'file-input',
          attrs: {
            type: 'file',
            accept: this.accept,
            multiple: this.multiple,
            disabled: this.isDisabled
          },
          on: {
            change: this.onChange
          }
        })
        : null,

      h('div', {
        staticClass: 'n-btn__content col row no-wrap flex-center'
      }, inner),

      this.loading !== null
        ? h('transition', {
            props: {
              name: 'fade'
            }
          }, this.loading ? [
            h('div', {
              key: 'loading',
              staticClass: 'absolute-full flex flex-center'
            }, this.$scopedSlots.loading !== void 0 ? this.$scopedSlots.loading() : [ h('NSpinner') ])
          ] : void 0
        )
        : null
    ])
  }
}

</script>