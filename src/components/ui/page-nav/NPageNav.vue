<template>

  <NToolbar class="n-page-nav">
    <div class="width-container mx-auto" style="height: 47px;">
      <div class="row items-center justify-between full-height">
        <NBtn v-if="btnBack" flat icon="back" @click="$router.back()" />

        <NToolbarTitle v-if="title">{{ title }}</NToolbarTitle>
        <NToolbarTitle v-else-if="$slots.title"><slot name="title" /></NToolbarTitle>

        <slot name="default" />

        <template v-if="tabs.length > 0">
          <NTabs
            class="pl-md"
            :items="tabs"
            routerMode />
        </template>
      </div>
    </div>
  </NToolbar>

</template>

<script>

export default {
  name: 'NPageNav',
  props: {
    tabs: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    btnBack: Boolean
  },
  computed: {
    classObj () {
      return {}
    },
  },
}

</script>