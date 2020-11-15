<template>

  <nav class="side-nav" :class="{ 'is-sticky': sticky }" :style="styleObj">

    <template v-for="(item, i) in items">
      <NLinkWrap v-if="!item.hide"
        class="side-nav-item"
        :class="{
          active: innerValue == item.value,
          inactive: item.inactive
        }"
        :key="i"
        :to="item.to"
        @click="onClick(item)" >
        <span :title="item.label">{{ item.label }}</span>
        <div v-if="!!+item.count" class="side-nav-item__badge">
          <NBadge digital>{{ item.count }}</NBadge>
        </div>
      </NLinkWrap>
    </template>

    <slot />

  </nav>

</template>

<script>

import debug from 'debug'
const logger = debug('components:NSideNav')

export default {
  name: 'NSideNav',
  props: {
    value: null,
    items: {
      type: Array,
      default () {
        return []
      }
    },
    routerMode: Boolean,
    routeQueryValue: {
      type: String,
      default: 'section'
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
    sticky: {
      type: [Boolean,Object],
      default: null
    }
  },
  data() {
    return {
      innerValue: null,
    }
  },
  computed: {
    styleObj () {
      return Object.assign({}, typeof this.sticky == 'object' ? this.sticky : {})
    }
  },
  provide: {
    main: this
  },
  watch: {
    value (val) {
      this.innerValue = val
    },
    '$route' (to, from) {
      if (this.routerMode) {
        let fromValue = from.query[this.routeQueryValue]
          , toValue = to.query[this.routeQueryValue]

        if (toValue == fromValue || this.innerValue == toValue) return
        
        this.innerValue = toValue
        this.emits()
      }
    }
  },
  methods: {
    emits () {
      this.$emit('input', this.innerValue)
    },
    onClick (item) {
      if (this.disabled || item.inactive/*  || this.innerValue == item.value */) return false
      this.innerValue = item.value
      if (this.routerMode) this.updateRoute()
      this.emits()
    },
    updateRoute (action) {
      let currentQuery = this.$route.query
      this.$router[action || this.routerAction]({ query: Object.assign({}, currentQuery, { [this.routeQueryValue]: this.innerValue || void 0 }) })
    }
  },
  created () {
    if (this.routerMode) {
      let valueByQuery = this.$route.query[this.routeQueryValue]
      logger('items: %O', this.items)
      logger('valueByQuery: %s, items include valueByQuery: %s', valueByQuery, this.items.findIndex(v => v.value == valueByQuery) > -1)
      if (valueByQuery && this.items.findIndex(v => v.value == valueByQuery) > -1) {
        this.innerValue = valueByQuery
        this.emits()
      }
      else if (this.value != void 0) {
        this.innerValue = this.value
        this.updateRoute('replace')
      } else this.innerValue = ''
    } else {
      if (this.value) this.innerValue = this.value
      else {
        let item = this.items.find(v => v.value == this.$route.name)
        if (item) this.innerValue = item.value
        else this.innerValue = ''
      }
    }
  },
}

</script>