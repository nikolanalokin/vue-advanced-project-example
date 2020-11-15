<template>
  <div class="loader">
    <NSpinner size="24px" :color="color" />
  </div>
</template>

<script>

export default {
  name: 'NLoader',
  props: {
    type: {
      type: String,
      default: 'circle'
    },
    infinite: {
      type: Boolean,
      default: true
    },
    color: String
  }
}

</script>