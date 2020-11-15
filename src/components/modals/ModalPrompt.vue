<template>

  <NModalBox 
    centered
    size="n" 
    name="prompt" 
    ref="dialog"
    @open="onopen"
    persistent>

    <template v-if="title">
      <div class="modal-box__header">
        <div class="modal-box__title">{{ title }}</div>
      </div>
    </template>

    <div class="pa-md">
      <NForm>
        <p class="text-body-n text-center" v-if="text">{{ text }}</p>

        <NInput
          v-model="value"
          autofocus />
      </NForm>
    </div>

    <div class="px-md py-sm">
      <div class="row justify-center gutter-x-sm">
        <NBtn
          flat
          color="dark-s"
          label="Назад"
          @click="close" />
          
        <NBtn
          ref="actionBtn"
          color="primary"
          :label="actionLabel"
          @click="done" />
      </div>
    </div>

  </NModalBox>

</template>

<script>

export default {
  name: 'ModalPrompt',
  data () {
    return {
      title: '',
      text: '',
      actionLabel: '',
      
      value: null,
      
      cb: () => {}
    }
  },
  methods: {
    onopen ({ payload, cb }) {
      this.title = payload.title || ''
      this.text = payload.text || ''
      this.actionLabel = payload.actionLabel || 'Подтвердить'

      this.value = payload.value || null

      if (cb) this.cb = cb
    },
    close () {
      this.$refs.dialog.hide()
      if (this.cb) this.cb(false)
    },
    done () {
      this.$refs.dialog.hide()
      if (this.cb) this.cb(this.value)
    },
  }
}

</script>