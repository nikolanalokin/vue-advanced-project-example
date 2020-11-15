import NIcon from '../icon/NIcon.vue'
import NSpinner from '../spinner/NSpinner.vue'

import slot from '../../../utils/slot'
import { stop } from '../../../utils/event'

import inputState from '../../../mixins/inputState'

export default {
  name: 'NField',
  inheritAttrs: false,
  mixins: [ inputState ],
  props: {
    value: [String,Number],

    label: String,
    floating: Boolean,
    hint: String,
    prefix: String,
    suffix: String,

    color: String,
    bgColor: String,
    dark: Boolean,

    outlined: Boolean,
    
    loading: Boolean,
    clearable: Boolean,
    counter: Boolean,
    
    disable: Boolean,
    readonly: Boolean,
    
    itemAligned: Boolean,

    autofocus: Boolean,

    bottomSlots: Boolean,
    hideBottomSpace: Boolean,

    maxlength: [Number, String],
    maxValues: [Number, String] // do not add to JSON, internally needed by NSelect
  },
  watch: {},
  data() {
    return {
      focused: false,
      innerLoading: false
    }
  },
  computed: {
    classObj () {
      return {
        [this.fieldClass]: this.fieldClass !== void 0,
        
        'theme_dark': this.dark === true,

        'is-focused': this.focused === true,
        'is-floating': this.floating === true,
        'is-outlined': this.outlined === true,
        'is-labeled': this.label !== void 0,

        'n-field_auto-height': this.$scopedSlots.control === void 0,
        'n-field_item-aligned': this.itemAligned,

        'n-field_with-bottom': this.hideBottomSpace !== true && this.shouldRenderBottom === true,

        'n-field_readonly': this.readonly,
        'n-field_disabled': this.disable,

        ...this.stateClasses
      }
    },

    contentClassList () {
      const cls = []

      if (this.error === true) {
        cls.push('text-negative')
      }
      else if (this.color !== void 0) {
        cls.push('text-' + this.color)
      }

      if (this.bgColor !== void 0) {
        cls.push(`bg-${this.bgColor}`)
      }

      return cls
    },

    editable () {
      return this.disable !== true && this.readonly !== true
    },

    hasValue () {
      let value = this.innerValue
      return value !== void 0 && value !== null && String(value).length > 0
    },

    shouldRenderBottom () {
      return this.bottomSlots === true || this.hint !== void 0 || this.counter === true
    },

    computedCounter () {
      if (this.counter !== false) {
        let length = typeof this.value === 'string' || typeof this.value === 'number'
          ? String(this.value).length
          : (Array.isArray(this.value) === true ? this.value.length : 0)
        let max = this.maxlength !== void 0 ? this.maxlength : this.maxValues

        return length + (max !== void 0 ? ' / ' + max : '')
      }
    },
  },
  methods: {
    focus () {
      let target = this.$refs.target
      if (target !== void 0) {
        target.matches('[tabindex]') || (target = target.querySelector('[tabindex]'))
        target !== null && target.focus()
      }
    },
    blur () {
      let el = document.activeElement
      this.$el.contains(el) && el.blur()
    },

    __onControlFocusin (e) {
      if (this.editable === true && this.focused === false) {
        this.focused = true
        this.$emit('focus', e)
      }
    },

    __onControlFocusout (e, then) {
      clearTimeout(this.focusoutTimer)
      this.focusoutTimer = setTimeout(() => {
        if (
          document.hasFocus() === true && (
            this.$refs === void 0 ||
            this.$refs.control === void 0 ||
            this.$refs.control.contains(document.activeElement) !== false
          )
        ) return

        if (this.focused === true) {
          this.focused = false
          this.$emit('blur', e)
        }

        then !== void 0 && then()
      })
    },

    __clearValue (e) {
      stop(e)
      this.$emit('input', null)
    },

    __getContent (h) {
      const node = []

      this.$scopedSlots.prepend !== void 0 && node.push(
        h('div', {
          staticClass: 'n-field__prepend n-field__marginal row no-wrap items-center',
          key: 'prepend'
        }, this.$scopedSlots.prepend())
      )

      node.push(
        h('div', {
          staticClass: 'n-field__control-container col relative-position row no-wrap n-anchor--skip'
        }, this.__getControlContainer(h))
      )

      if (this.loading === true || this.innerLoading === true) {
        node.push(
          this.__getInnerAppendNode(
            h,
            'inner-loading-append',
            this.$scopedSlots.loading !== void 0
              ? this.$scopedSlots.loading()
              : [ h(NSpinner, { props: { color: this.color } }) ]
          )
        )
      }

      if (this.clearable === true && this.hasValue === true && this.editable === true) {
        node.push(
          this.__getInnerAppendNode(h, 'inner-clearable-append', [
            h(NIcon, {
              staticClass: 'cursor-pointer',
              props: { name: 'close' },
              on: {
                click: this.__clearValue
              }
            })
          ])
        )
      }

      this.$scopedSlots.append !== void 0 && node.push(
        h('div', {
          staticClass: 'n-field__append n-field__marginal row no-wrap items-center',
          key: 'append'
        }, this.$scopedSlots.append())
      )

      this.__getInnerAppend !== void 0 && node.push(
        this.__getInnerAppendNode(h, 'inner-append', this.__getInnerAppend(h))
      )

      this.label !== void 0 && node.push(
        h('div', {
          staticClass: 'n-field__label no-pointer-events absolute ellipsis'
        }, [ this.label ])
      )

      this.__getPopup !== void 0 && node.push(
        this.__getPopup(h)
      )

      return node
    },

    __getControlContainer (h) {
      const node = []

      this.prefix !== void 0 && this.prefix !== null && node.push(
        h('div', {
          staticClass: 'n-field__prefix no-pointer-events row items-center'
        }, [ this.prefix ])
      )

      if (this.__getControl !== void 0) {
        node.push(
          this.__getControl(h)
        )
      }
      // internal usage only:
      else if (this.$scopedSlots.rawControl !== void 0) {
        node.push(this.$scopedSlots.rawControl())
      }
      else if (this.$scopedSlots.control !== void 0) {
        node.push(
          h('div', {
            ref: 'target',
            staticClass: 'n-field__native row',
            attrs: {
              ...this.$attrs,
              autofocus: this.autofocus
            }
          }, this.$scopedSlots.control())
        )
      }

      this.suffix !== void 0 && this.suffix !== null && node.push(
        h('div', {
          staticClass: 'n-field__suffix no-pointer-events row items-center'
        }, [ this.suffix ])
      )

      return node.concat(
        this.__getDefaultSlot !== void 0
          ? this.__getDefaultSlot(h)
          : slot(this, 'default')
      )
    },

    __getBottom (h) {
      let msg, key

      if (this.hint !== void 0) {
        msg = [ h('div', [ this.hint ]) ]
        key = this.hint
      }
      else {
        msg = slot(this, 'hint')
        key = 'n--slot-hint'
      }

      const hasCounter = this.counter === true || this.$scopedSlots.counter !== void 0

      if (this.hideBottomSpace === true && hasCounter === false && msg === void 0) {
        return
      }

      const main = h('div', {
        key,
        staticClass: 'n-field__messages col'
      }, msg)

      return h('div', {
        staticClass: 'n-field__bottom row items-start'
      }, [
        h('div', {
          staticClass: 'n-field__messages col',
          key
        }, msg),

        hasCounter === true
          ? h('div', {
            staticClass: 'n-field__counter'
          }, this.$scopedSlots.counter !== void 0 ? this.$scopedSlots.counter() : [ this.computedCounter ])
          : null
      ])
    },

    __getInnerAppendNode (h, key, content) {
      return h('div', {
        staticClass: 'n-field__append n-field__marginal row no-wrap items-center n-anchor--skip',
        key
      }, content)
    },
  },

  render (h) {
    this.__onPreRender !== void 0 && this.__onPreRender()
    this.__onPostRender !== void 0 && this.$nextTick(this.__onPostRender)
    
    return h('div', {
      staticClass: 'n-field row no-wrap items-start',
      class: this.classObj
    }, [
      this.$scopedSlots.before !== void 0 ? h('div', {
        staticClass: 'n-field__before n-field__marginal row no-wrap items-center'
      }, this.$scopedSlots.before()) : null,

      h('div', {
        staticClass: 'n-field__inner relative-position col self-stretch column justify-center'
      }, [
        h('div', {
          ref: 'control',
          staticClass: 'n-field__control relative-position row no-wrap',
          class: this.contentClassList,
          attrs: { tabindex: -1 },
          on: this.controlEvents
        }, this.__getContent(h)),

        this.shouldRenderBottom === true
          ? this.__getBottom(h)
          : null
      ]),

      this.$scopedSlots.after !== void 0 ? h('div', {
        staticClass: 'n-field__after n-field__marginal row no-wrap items-center'
      }, this.$scopedSlots.after()) : null
    ])
  },

  created () {
    this.__onPreRender !== void 0 && this.__onPreRender()

    this.controlEvents = this.__getControlEvents !== void 0
      ? this.__getControlEvents()
      : {
        focus: this.focus,
        focusin: this.__onControlFocusin,
        focusout: this.__onControlFocusout,
      }
  },

  mounted () {
    this.autofocus === true && setTimeout(this.focus)
  },

  beforeDestroy () {
    clearTimeout(this.focusoutTimer)
  }
}