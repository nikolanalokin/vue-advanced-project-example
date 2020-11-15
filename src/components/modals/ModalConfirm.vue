<template>

  <NModalBox 
    centered
    size="n" 
    name="confirm" 
    ref="dialog"
    @open="onopen">

    <template v-if="title">
      <div class="modal-box__header">
        <div class="modal-box__title">{{ title }}</div>
      </div>
    </template>

    <div class="pa-md">
      <NForm>
        <p class="text-body-l text-center" v-if="text">{{ text }}</p>

        <div class="row flex-center" v-if="checkbox">
          <NCheckbox :label="checkbox.label" v-model="checkbox.value" />
        </div>
      </NForm>
    </div>

    <div class="px-md py-sm">
      <div class="row justify-center gutter-x-sm">
        <NBtn
          flat
          color="dark-s"
          :label="cancelLabel"
          @click="close" />
          
        <NBtn
          ref="actionBtn"
          :color="type"
          :label="actionLabel"
          @click="done" />
      </div>
    </div>

  </NModalBox>

</template>

<script>

export default {
  name: 'ModalConfirm',
  data () {
    return {
      title: '',
      text: '',
      type: '',
      actionLabel: '',
      cancelLabel: '',

      checkbox: {
        label: '',
        value: false
      },
      
      cb: () => {}
    }
  },
  methods: {
    onopen ({ payload, cb }) {
      this.title = payload.title || ''
      this.text = payload.text || ''
      this.checkbox = payload.checkbox || null
      this.type = payload.type || 'success'
      this.actionLabel = payload.actionLabel || 'Подтвердить'
      this.cancelLabel = payload.cancelLabel || 'Закрыть'

      if (cb) this.cb = cb

      this.$nextTick(() => {
        this.$refs.actionBtn.focus()
      })
    },
    close () {
      this.$refs.dialog.hide()
      if (this.cb) this.cb(false)
    },
    done () {
      this.$refs.dialog.hide()
      this.$emit('done')
      if (this.cb) this.cb(true, this.checkbox ? {
        checkbox: this.checkbox.value
      } : void 0)
    },
  }
}

</script>