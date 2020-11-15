<template>

  <div class="radio-group" :value="value" @localchange="onLocalChange">
    <slot :name="name"></slot>
  </div>

</template>

<script>

export default {
  name: 'NRadioGroup',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {

    }
  },
  methods: {
    onLocalChange: function (value) {
      this.value = value
      this.$emit('change', this.value)
    }
  },
}

</script>