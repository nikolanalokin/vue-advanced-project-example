<template>

  <div class="n-block"
    v-on="$listeners">
    <div class="n-block__header" v-if="$slots.header">
      <slot name="header" />
    </div>

    <div class="n-block__body" v-if="$slots.body">
      <slot name="body" />
    </div>

    <slot />

    <div class="n-block__footer" v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
  
</template>

<script>

export default {
  name: 'NBlock',
  computed: {
    
  }
}

</script>