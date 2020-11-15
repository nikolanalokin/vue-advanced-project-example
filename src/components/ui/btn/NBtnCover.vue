<template>

  <label 
    class="btn-cover" 
    :style="styleObj"
    :class="classObj"
    @click="$emit('click', $event)">

    <img class="btn-cover__cover" :src="innerValue" alt="" >
    <input v-if="fileInput" type="file" class="file-input" accept="image/*" @change="onChange">

    <div class="btn-cover__overlay absolute-full column flex-center">
      <transition name="fade">
        <NSpinner v-if="loading" :size="icon ? iconSize : '24px'" color="dark-s" />
        <NIcon v-else-if="icon" :name="icon" :size="iconSize" class="text-color-t" />
      </transition>
      
      <transition name="fade">
        <p v-if="placeholder && !loading" class="text-body-n text-center text-color-s">{{ placeholder }}</p>
      </transition>
    </div>
    
  </label>

</template>

<script>

export default {
  name: 'NBtnCover',
  props: {
    value: String,
    fileInput: Boolean,
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: [Number, String],
      default: '48px'
    },
    loading: Boolean,
    ratio: Number
  },
  data () {
    return {
      innerValue: '',
      rootW: null,
      file: null
    }
  },
  watch: {
    value (val) {
      this.innerValue = val || ''
    },
  },
  computed: {
    classObj () {
      return `is-${this.state}`
    },
    styleObj () {
      return {
        height: this.ratio ? `${Math.floor( this.rootW / this.ratio )}px` : '100%'
      }
    },
    state () {
      return this.loading ? 'loading' : this.innerValue ? 'filled' : 'empty'
    },
  },
  methods: {
    onclick (e) {
      this.$emit('click')
    },
    onChange (e) {
      let files = e.target.files || e.dataTransfer.files
      this.file = files[0]
      
      if (this.file) this.loadImage(this.file)
    },
    loadImage (file) {
      this.$emit('select', file)
      this.reader.readAsDataURL(file)
    },
  },
  created () {
    if (this.value) this.innerValue = this.value

    this.reader = new FileReader()
    this.reader.onload = e => {
      this.innerValue = e.target.result
      this.$emit('input', this.innerValue)
    }
  },
  mounted () {
    this.rootW = this.$el.offsetWidth
  },
}

</script>