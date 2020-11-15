<template>

  <NModalBox 
    centered
    name="log-in"
    size="s"
    ref="dialog"
    @open="onopen" >

    <div class="pa-lg">
      <div class="text-h2 text-center mb-lg">Вход</div>

      <div class="text-body-n text-center mb-xl" v-if="!!text">{{ text }}</div>
      
      <LoginForm @done="onLogIn" />
    </div>

  </NModalBox>

</template>

<script>

import API from '../../services/api'
import * as types from '../../store/mutation-types'
import events from '../../utils/bus';

export default {
  name: 'ModalLogIn',
  data () {
    return {
      text: '',

      processing: false,
      isError: false
    }
  },
  methods: {
    onopen ({ payload }) {
      this.text = payload && payload.text || ''
    },
    onLogIn () {
      events.$emit('log-in')
      this.close()
    },
    close () {
      this.$refs.dialog.hide()
    },
  },
}

</script>