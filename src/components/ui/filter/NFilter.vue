<template>

  <div class="filter scroll-x" :class="classObj">
    <label v-if="label" class="filter__label" v-html="label"></label>
    <div class="filter__wrap no-wrap" :class="{ 'row width-100': align == 'justify' }">
      <label
        class="filter__item relative-position"
        v-for="(item, index) in items"
        :class="{ 
          disabled: item.disabled, 
          selected: multiple ? innerValue.some(value => value == item.value) : innerValue == item.value,
          col: align == 'justify'
        }"
        :key="index" >

        <input
          class="filter__native"
          :type="multiple ? 'checkbox' : 'radio'"
          :value="item.value"
          :disabled="item.disabled"
          v-model="innerValue"
          @change="onChange(item)" >

        <span>{{ item.label }}</span>
        <span v-if="item.count != undefined" class="filter__counter">{{ item.count }}</span>
      </label>
    </div>
  </div>

</template>

<script>

import debug from 'debug'
const logger = debug('components:NFilter')

export default {
  name: 'NFilter',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    routerMode: Boolean,
    routeQueryValue: {
      type: String,
      default: 'filter'
    },
    routerAction: {
      type: String,
      default: 'replace',
      validator (value) {
        return value == 'replace' || value == 'push'
      }
    },
    debug: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left',
      validator: v => ['left','right','center','justify'].includes(v)
    },
    inline: Boolean,
  },
  watch: {
    value (newValue) {
      this.innerValue = this.value
    },
    multiple (newValue) {
      this.innerValue = newValue ? [] : null
    },
    '$route' (to, from) {
      let fromValue = from.query[this.routeQueryValue]
        , toValue = to.query[this.routeQueryValue]

      if (toValue == fromValue || this.innerValue == toValue) return
      
      this.innerValue = toValue
      this.emits(toValue)
    },
  },
  data () {
    return {
      innerValue: null,
    }
  },
  computed: {
    classObj () {
      return {
        'is-inline': this.inline,
        [`align_${this.align}`]: this.align,
      }
    },
  },
  methods: {
    emits () {
      this.$emit('change', this.innerValue)
    },
    onChange (item) {
      if (this.routerMode) this.updateRoute()
      this.emits()
    },
    updateRoute (action) {
      let currentQuery = this.$route.query
      this.$router[action || this.routerAction]({ query: Object.assign({}, currentQuery, { [this.routeQueryValue]: this.innerValue || void 0 }) })
    },
  },
  created () {
    // logger('items: %O', this.items)
    if (this.routerMode) {
      let valueByQuery = this.$route.query[this.routeQueryValue]
      // logger('valueByQuery: %s, items include valueByQuery: %s', valueByQuery, this.items.findIndex(v => v.value == valueByQuery) > -1)
      if (valueByQuery && this.items.findIndex(v => v.value == valueByQuery) > -1) {
        this.innerValue = valueByQuery
        this.emits()
      }
      else if (this.value != void 0) {
        this.innerValue = this.value
        this.updateRoute('replace')
      } else {
        if (this.multiple) {
          this.innerValue = []
        } else {
          this.innerValue = ''
        }
      }
    } else {
      if (this.value) this.innerValue = this.value
      else {
        if (this.multiple) {
          this.innerValue = []
        } else {
          this.innerValue = ''
        }
      }
    }
  },
}

</script>