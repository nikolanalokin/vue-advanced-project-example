<template>

  <NModalBox 
    centered
    size="n"
    name="alert" 
    ref="dialog"
    @open="onopen">

    <template v-if="data && data.title || title">
      <div class="modal-box__header">
        <div class="modal-box__title">{{ data && data.title || title }}</div>
      </div>
    </template>

    <div class="pa-md">
      <p class="text-body-l text-center" v-html="data && data.text || text"></p>
    </div>

    <div class="px-md py-sm">
      <div class="row justify-center gutter-x-sm">
        <NBtn
          flat
          color="dark-s"
          label="Понятно"
          @click="close" />
      </div>
    </div>

  </NModalBox>

</template>

<script>

export default {
  name: 'ModalAlert',
  props: {
    title: String,
    text: String,
    type: {
      type: String,
      default: 'confirm'
    },
    actionLabel: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      data: null,
      cb: () => {}
    }
  },
  methods: {
    onopen ({ payload, cb }) {
      this.data = payload
      this.cb = cb
    },
    close () {
      this.$refs.dialog.hide()
      if (this.cb) this.cb(false)
    },
    done () {
      this.$refs.dialog.hide()
      this.$emit('done')
      if (this.cb) this.cb(true)
    },
  }
}

</script>