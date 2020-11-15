<template>
  <a class="link" :href="url" :title="url" @click.prevent="check">
    <slot />
  </a>
</template>

<script>

import API from '../../../services/api'
import * as types from '../../../store/mutation-types'

export default {
  name: 'NLink',
  props: {
    url: String
  },
  methods: {
    async check () {
      try {
        let response = await API.utils.checkLink({ url: this.url })

        if (response.response.is_banned == 0) {
          window.open(this.url, '_blank')
        }
        else {
          this.$store.dispatch(types.MODAL_OPEN, {
            name: 'alert',
            payload: {
              text: `Ссылка заблокирована по причине: "${response.response.description}"`
            }
          })
        }
      }
      catch (err) {
        console.warn(err)
      }
    }
  }
}

</script>