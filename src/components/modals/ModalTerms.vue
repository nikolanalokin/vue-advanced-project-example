<template>

  <NModalBox
    centered
    size="l"
    name="terms"
    ref="dialog"
    @open="onopen">

    <div class="scroll-y" style="height: 75vh">
      <div class="pa-lg">
        <LicenseModule v-if="section == 'terms'" />
        <TermsOfUseModule v-if="section == 'licence'" />
        <TermsProcessingModule v-if="section == 'ccterms'" />
      </div>
    </div>

  </NModalBox>

</template>

<script>

import API from '../../services/api'

import LicenseModule from '../../views/pages/terms/LicenseModule.vue'
import TermsOfUseModule from '../../views/pages/terms/TermsOfUseModule.vue'
import TermsProcessingModule from '../../views/pages/terms/TermsProcessingModule.vue'

export default {
  name: 'ModalTerms',
  components: {
    LicenseModule,
    TermsOfUseModule,
    TermsProcessingModule
  },
  data () {
    return {
      section: 'terms',
      cb: () => {},
    }
  },
  methods: {
    clear () {
      
    },
    onopen ({ payload, cb }) {
      this.section = payload
    },
    done () {
      this.close()
    },
    close () {
      this.$refs.dialog.hide()
    },
  },
}

</script>