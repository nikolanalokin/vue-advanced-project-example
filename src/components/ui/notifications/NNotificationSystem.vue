<template>

  <div
    class="n-notification n-notification_system"
    :class="classObj"
    @click="close">

    <div class="n-notification__container">
      <div class="n-notification__title">{{ data.title }}</div>
      <div class="n-notification__body">{{ data.body }}</div>
    </div>

  </div>
</template>

<script>

import NotifyMixin from './notify-mixin'

export default {
  name: 'NNotificationSystem',
  mixins: [NotifyMixin],
  props: {
    data: Object
  },
  computed: {
    type () { return this.data.type },
    classObj () {
      return {
        'is-info': this.type == 'info',
        'is-success': this.type == 'confirm' || this.type == 'success',
        'is-warning': this.type == 'warning' || this.type == 'warn',
        'is-error': this.type == 'danger' || this.type == 'error',
      }
    },
    timerStyleObj () {
      return {
        width: `${this.timerWidth}%`
      }
    }
  },
  created () {
    this.timerPlay()
  },
}

</script>