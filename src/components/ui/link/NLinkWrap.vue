<template>

  <router-link v-if="isLink" 
    :to="to"
    :class="classObj"
    v-on="$listeners"
    @click.native="$emit('click', $event)" >
    <slot />
  </router-link>

  <div v-else v-on="$listeners">
    <slot />
  </div>

</template>

<script>

export default {
  name: 'NLinkWrap',
  props: {
    to: [String,Object],
    linkClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    isLink () { return !!this.to },
    classObj () {
      return { 
        [this.linkClass]: this.isLink
      }
    }
  },
}

</script>