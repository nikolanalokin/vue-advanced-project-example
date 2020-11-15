<template>
  
  <portal to="modalContainer">
    <div 
      v-if="opened"
      v-show="shown"
      ref="modal"
      class="modal-box"
      :class="classObj"
      :name="name"
      :key="name">
      <div class="modal-box__loader" v-if="loading">
        <NSpinner size="24px" />
      </div>

      <template v-else>
        <slot />
      
        <div class="modal-box__close" @click="hide" v-if="closeBtn">
          <NIcon name="close" size="24px" />
        </div>
      </template>
    </div>
  </portal>

</template>

<script>

import { events } from '../../../utils/bus'
import * as types from '../../../store/mutation-types'

import ModelToggleMixin from '../../../mixins/model-toggle'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NModalBox',

  // mixins: [ ModelToggleMixin ],

  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'n'
    },
    extraClass: String,
    persistent: Boolean,
    transparent: Boolean,
    value: Boolean,
    closeBtn: {
      type: Boolean,
      default: true
    },
    loading: Boolean,
    centered: Boolean
  },
  data () {
    return {
      innerValue: false
    }
  },
  watch: {
    value (val) {
      this.innerValue = val
      
      if (val) this.show()
      else this.hide()
    }
  },
  computed: {
    opened () {
      // console.log(this.name, this.modalCurrentName, this.innerValue, this.modalCurrentIndex, this.modalHistory.indexOf(this.name));
      // return (this.name == this.modalCurrentName/*  || this.innerValue */) && this.modalCurrentIndex == this.modalHistory.indexOf(this.name)
      return this.modalHistory.indexOf(this.name) > -1
    },
    shown () {
      return this.modalCurrentName == this.name && this.modalCurrentIndex == this.modalHistory.indexOf(this.name)
    },
    classObj () {
      return {
        [`size-${this.size}`]: !this.loading && this.size,
        [this.extraClass]: this.extraClass,
        'is-transparent': this.transparent,
        'ma-auto': this.centered
      }
    },
    ...mapGetters([
      'modalCurrentName',
      'modalCurrentIndex',
      'modalHistory',
    ])
  },
  methods: {
    onopen (name, payload, cb) {
      if (this.name == name) {
        // this.opened = true
        this.$nextTick(() => {
          this.show()
          this.$emit('open', { payload, cb })
          window.addEventListener('keydown', this.onkeydown)
        })
      }
    },
    emits () {
      this.$emit('input', this.innerValue)
    },
    show () {
      if (this.modalCurrentIndex == -1) this.$store.dispatch(types.MODAL_OPEN, this.name)
      this.innerValue = true
      this.emits()
    },
    hide () {
      this.innerValue = false
      this.emits()
      this.$emit('close', this.name)
      window.removeEventListener('keydown', this.onkeydown)
      this.close()
    },
    onBackdropClose () {
      if (this.opened && this.shown && !this.persistent) this.$nextTick(this.hide)
    },
    onkeydown (evt) {
      if (evt.keyCode == '27') {
        if (this.opened && this.shown && !this.persistent) this.$nextTick(this.hide)
      }
    },
    ...mapActions({
      close: types.MODAL_CLOSE
    })
  },
  created () {
    this.innerValue = this.value

    events.$on('modal:open', this.onopen)
    events.$on('modal:close', this.onBackdropClose)
  },
  beforeDestroy () {
    events.$off('modal:open', this.onopen)
    events.$off('modal:close', this.onBackdropClose)
  }
}
  
</script>