<template>

  <label
    class="n-btn-add flex"
    :style="styleObj">
    <input v-if="type == 'file'"
      type="file"
      class="file-input"
      :accept="accept" 
      :multiple="multiple" 
      @change="onChange">

    <div class="n-btn-add__overlay absolute-full column flex-center">
      <NIcon :name="icon" :size="iconSize" class="text-color-t" />
      <p class="text-body-n text-color-s" v-if="placeholder">{{ placeholder }}</p>
    </div>
  </label>

</template>

<script>

export default {
  name: 'NBtnAdd',
  props: {
    icon: {
      type: String,
      default: 'add'
    },
    iconSize: {
      type: String,
      default: '48px'
    },
    placeholder: String,
    type: {
      type: String,
      default: 'button'
    },
    multiple: Boolean,
    accept: String,
    ratio: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      rootW: null,
    }
  },
  computed: {
    styleObj () {
      return {
        height: `${Math.floor( this.rootW / this.ratio )}px`
      }
    },
  },
  methods: {
    onChange (e) {
      this.$emit('select', e.target.files || e.dataTransfer.files)
    },
  },
  mounted () {
    this.rootW = this.$el.offsetWidth
  },
}

</script>