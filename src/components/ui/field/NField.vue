<template>

  <div class="n-field row no-wrap items-start" :class="classObj">
    <div v-if="$scopedSlots.before !== void 0" class="n-field__before n-field__marginal row no-wrap items-center">
      <slot name="before" />
    </div>

    <div class="n-field__inner relative-position col self-stretch column justify-center">
      <div v-if="label !== void 0" class="n-field__label no-pointer-events ellipsis">{{ label }}</div>

      <div class="n-field__control relative-position row no-wrap"
        tabindex="-1"
        ref="control"
        v-on="listeners">
        <div v-if="$scopedSlots.prepend !== void 0" class="n-field__prepend n-field__marginal row no-wrap items-center">
          <slot name="prepend" />
        </div>
        
        <div class="n-field__control-container col relative-position row no-wrap">
          <div v-if="$scopedSlots.prefix !== void 0" class="n-field__prefix no-pointer-events row items-center">
            <slot name="prefix" />
          </div>
          <div v-if="$scopedSlots.control !== void 0" class="n-field__native row"
            ref="target"
            v-bind="{
              ...$attrs,
              autofocus
            }">
            <slot name="control" />
          </div>
          <div v-if="$scopedSlots.suffix !== void 0" class="n-field__suffix no-pointer-events row items-center">
            <slot name="suffix" />
          </div>
        </div>

        <!-- <div v-if="error" class="n-field__append n-field__marginal row no-wrap items-center">
          <slot name=""></slot>
        </div> -->

        <div v-if="loading" class="n-field__append n-field__marginal row no-wrap items-center">
          <slot name="loading">
            <NSpinner color="primary" />
          </slot>
        </div>

        <div v-if="clearable && hasValue && editable" class="n-field__append n-field__marginal row no-wrap items-center">
          <slot name="clearable">
            <NIcon name="close" class="cursor-pointer" @click="__clearValue" />
          </slot>
        </div>

        <div v-if="$scopedSlots.append !== void 0" class="n-field__append n-field__marginal row no-wrap items-center">
          <slot name="append" />
        </div>
      </div>

      <div v-if="shouldRenderBottom" class="n-field__bottom row items-start">
        <div class="n-field__message col">
          <div>{{ hint }}</div>
        </div>
        <div v-if="counter" class="n-field__counter">{{ computedCounter }}</div>
      </div>
    </div>

    <div v-if="$scopedSlots.after !== void 0" class="n-field__after n-field__marginal row no-wrap items-center">
      <slot name="after" />
    </div>
  </div>

</template>

<script>

export default {
  name: 'NField',
  inheritAttrs: false,
  props: {
    value: [String,Number],

    label: String,
    hint: String,
    prefix: String,
    suffix: String,

    dark: Boolean,
    
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
        'theme_dark': this.dark === true,

        'is-focused': this.focused === true,
        'is-labeled': this.label !== void 0,

        'n-field_auto-height': this.$scopedSlots.control === void 0,
        'n-field_item-aligned': this.itemAligned,

        'n-field_with-bottom': this.hideBottomSpace !== true && this.shouldRenderBottom === true,

        'n-field_readonly': this.readonly,
        'n-field_disabled': this.disable
      }
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

    listeners () {
      return {
        focus: this.focus,
        focusin: this.__onControlFocusin,
        focusout: this.__onControlFocusout,
      }
    }
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
      e.stopPropagation()
      this.$emit('input', null)
    }
  },

  mounted () {
    this.autofocus === true && setTimeout(this.focus)
  },

  beforeDestroy () {
    clearTimeout(this.focusoutTimer)
  }
}

</script>