<template>

  <NLinkWrap 
    :to="deleted ? null : to"
    v-on="$listeners"
    :class="{
      'n-card-wrapper--verified': !!verified,
      'link-underline': !!to,
      'n-hoverable cursor-pointer': clickable
    }"
    :style="styleObj"
    class="n-card-wrapper">
    <NCard :block="block">
      <NCardSection>
        <div class="flex flex-center">
          <NAvatar class="q-mx-auto"
            :size="avatarSize" 
            :type="+oid > 0 ? 'user' : 'community'"
            :urls="urls"
            :oid="oid"
            :online="avatarOnline">
            <template v-slot:actions>
              <slot name="avatar-action" />
            </template>
            <template v-slot:top-right>
              <NSVG v-if="verified == 1" name="check" color="primary" size="16px" />
              <NIcon v-if="verified == 2" name="approval" color="primary" size="16px" />
            </template>
          </NAvatar>
        </div>
      </NCardSection>
      <NCardSection v-if="primary || secondary || tertiary || $slots.primary || $slots.secondary || $slots.tertiary">
        <div
          v-if="primary || $slots.primary"
          class="text-color-p text-body-n-bold text-center"
          :class="[ twoLine ? 'ellipsis-2-lines' : 'ellipsis' ]">{{ primary }}<slot name="primary" /></div>
        <div
          v-if="secondary || $slots.secondary"
          class="text-color-s ellipsis text-body-s">{{ secondary }}<slot name="secondary" /></div>
        <div
          v-if="tertiary || $slots.tertiary"
          class="text-color-t ellipsis text-body-s">{{ tertiary }}<slot name="tertiary" /></div>
      </NCardSection>
    </NCard>
    
    <div v-if="clickable" class="n-focus-helper"></div>
  </NLinkWrap>

</template>

<script>

export default {
  name: 'NCardWrapper',
  props: {
    to: null,

    oid: [Number,String],

    width: [Number,String],    
    tabindex: [String, Number],

    deleted: Boolean,

    urls: [Object,String],

    primary: null,
    secondary: null,
    tertiary: null,

    twoLine: Boolean,

    avatarSize: {
      type: Number,
      default: 80
    },
    avatarOnline: Boolean,

    verified: Number,
    clickable: Boolean,

    block: Boolean,

    actions: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      actionsOpened: false
    }
  },
  computed: {
    styleObj () {
      return {
        width: this.width || '',
      }
    },
    isClickable () {
      return !!this.to || this.clickable
    }
  },
}

</script>

<style lang="scss">

@import '../../../sass/_imports.scss';

.n-card-wrapper {
  position: relative;
  border-radius: $br--main;
  &.n-card-wrapper--verified {}
}

</style>