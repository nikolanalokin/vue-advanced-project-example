<template>

  <div
    class="n-notification n-notification_main"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave">

    <div class="n-notification__header row no-wrap items-center">
      <div class="n-notification__title ellipsis flex-max">{{ data.title }}</div>

      <div class="n-notification__close flex">
        <NBtn
          flat
          dense
          size="sm"
          color="white"
          icon="close"
          @click.prevent="close" />
      </div>
    </div>

    <NLinkWrap
      class="n-notification__container"
      :to="data.link">
      <div class="n-notification__avatar" v-if="data.avatarUrls">
        <NAvatar
          :urls="data.avatarUrls"
          @click.prevent="onProfileLinkClick" />
      </div>
      <div class="n-notification__body">
        <!-- <span>{{ data.body }}</span> -->
        <NTextWrap :data="data.body" inline />
      </div>
    </NLinkWrap>

    <!-- <div v-if="showDuration"
      class="n-notification__timer"
      :style="timerStyleObj"></div> -->

  </div>
</template>

<script>

import NotifyMixin from './notify-mixin'

export default {
  name: 'NNotification',
  mixins: [NotifyMixin],
  props: {
    data: Object,
    type: {
      type: String,
      default: 'default'
    }
  },
  watch: {
    '$appVisible' (val) {
      if (val) {
        this.timerPlay()
      } else {
        this.timerPause()
      }
    },
  },
  computed: {
    timerStyleObj () {
      return {
        width: `${this.timerWidth}%`
      }
    },
    hasProfileLink () {
      return !!this.data.profileLink
    }
  },
  methods: {
    onProfileLinkClick (e) {
      if (this.hasProfileLink) {
        this.$router.push(this.data.profileLink)
        this.close()
      }
    },
    onMouseEnter () {
      this.timerPause()
    },
    onMouseLeave () {
      this.timerPlay()
    }
  },
  created () {
    this.timerPlay()
    if (!this.$appVisible) this.timerPause()
  }
}

</script>