<template>

  <div class="n-notifications-container">

    <transition-group name="fade" tag="div">
      <component
        v-for="item in shownList"
        :key="item.id"
        :is="item.isSystem ? 'NNotificationSystem' : 'NNotification'"
        :data="item"
        :duration="item.isSystem ? 8000 : 20000"
        @destroy="onItemDestroy" />
    </transition-group>

  </div>

</template>

<script>

import { events } from '../../../utils/bus'

const _defs = {
  systemTypes: ['info','confirm','success','warning','warn','danger','error'],
}

export default {
  name: 'NNotificationsContainer',
  data () {
    return {
      list: []
    }
  },
  computed: {
    shownList () {
      return this.list.slice(0, 12)
    }
  },
  methods: {
    onItemAdd (params) {
      let data = Object.assign({}, params, {
        isSystem: _defs.systemTypes.includes(params.type),
        title: params.title || '',
        body: params.text || params.body || ''
      })

      this.list.push(data)

      events.$emit('notify:added', data.id)
    },
    onItemDestroy (id) {
      this.list.remove(this.list.findIndex(v => v.id == id))
    }
  },
  created () {
    events.$on('notify:add', this.onItemAdd)
  },
  mounted () {
    events.$emit('notify:component-inited')
  },
  beforeDestroy () {
    events.$off('notify:add', this.onItemAdd)
  },
}

</script>