<template>

  <button
    type="button"
    class="btn"
    :class="classObj"
    :title="value ? onTitle : offTitle"
    @click.stop.prevent="onClick"
    v-on="$listeners" >
    <NSpinner class="btn__loader" v-if="mutableLoading" />
    <NIcon v-else-if="type == 'icon' && onName && offName" :name="value ? onName : offName" :size="iconSize" />
    <span v-else-if="type == 'text' && onName && offName">{{ value ? onName : offName }}</span>
    <slot v-else />
  </button>

</template>

<script>
export default  {
  name: 'NBtnToggle',
  props: {
    type: {
      type: String,
      default: 'icon'
    },
    onName: {
      type: String,
      default: ''
    },
    offName: {
      type: String,
      default: ''
    },
    onTitle: {
      type: String,
      default: ''
    },
    offTitle: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    toggleClass: {
      type: String,
      default: ''
    },
    iconSize: {
      type: String,
      default: '24px'
    },
    classOnly: Boolean,
    dense: Boolean,
    onToggle: {
      type: Function,
      default () {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    loading: Boolean
  },
  data() {
    return {
      mutableValue: null,
      mutableLoading: false
    }
  },
  watch: {
    value (value) {
      this.mutableValue = value
    },
    loading (value) {
      this.mutableLoading = value
    }
  },
  methods: {
    onClick (event) {
      this.mutableLoading = true
      this.onToggle(!this.mutableValue)
      .then(result => {
        this.mutableValue = !this.mutableValue
        this.$emit('input', this.mutableValue)
      })
      .catch(error => {
        
      })
      .finally(() => {
        this.mutableLoading = false
      })
    }
  },
  computed: {
    classObj: function () {
      return {
        'btn-icon': this.type == 'icon',
        'btn-text': this.type == 'text',
        [this.toggleClass]: this.value,
        'dense': this.dense,
      }
    }
  },
  created () {
    this.mutableValue = this.value
    this.mutableLoading = this.loading
  },
}
</script>