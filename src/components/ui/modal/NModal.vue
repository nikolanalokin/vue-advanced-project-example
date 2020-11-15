<template>
  
  <transition name="fade">
    <portal-target
      v-show="modalOpened"
      class="modal"
      name="modalContainer"
      multiple
      @click.self.native="close" />
  </transition>

</template>

<script>

import { events } from '@/utils/bus'
import * as types from '../../../store/mutation-types'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NModal',

  // provide () {
  //   return {
  //     modal: this
  //   }
  // },

  computed: {
    ...mapGetters([
      'modalOpened'
    ])
  },

  methods: {
    close () {
      events.$emit('modal:close')
    }
  },
}
  
</script>