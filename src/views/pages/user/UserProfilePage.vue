<template>

  <NPage class="pb-md" itemscope itemtype="https://schema.org/Person">
    <div class="row">
      Профиль пользователя
    </div>
  </NPage>

</template>

<script>

import $store from '../../../store'
import API from '../../../services/api'
import {
  getLink,
  getLinkByData
} from '../../../utils'
import * as types from '../../../store/mutation-types'
import { events } from '../../../utils/bus'

const _defs = {
  appbarActions: (isOwn) => {
    return {
      back: !isOwn
    }
  }
}

export default {
  name: 'UserProfilePage',

  props: {
    data: null,
    uid: [String,Number],
  },
  
  data () {
    return {
      userResponse: {},
      uData: { counters: {} }
    }
  },

  watch: {
    data (val) {
      this.userResponse = val.response
      this.uData = val.data
    },
    uData () {
      this.$store.dispatch(types.APPBAR_UPDATE_BY_CODE, {
        data: _defs.appbarActions(this.$isOwn),
        method: 'assign'
      })
    }
  },

  computed: {
    cuid () { return this.uData.id },
  },
  methods: {
    async loadGeneralData () {
      let { response, data } = await this.$store.dispatch('loadUserProfileData', this.cuid)
      this.userResponse = response
      this.uData = data
    }
  },
  created () {
    events.$on('after-registration:complete', this.loadGeneralData)

    if (this.data) {
      this.userResponse = this.data.response
      this.uData = this.data.data
    }
    else {
      this.userResponse = this.$store.getters.userProfileData.response
      this.uData = this.$store.getters.userProfileData.data
    }
  },
  beforeDestroy () {
    events.$off('after-registration:complete', this.loadGeneralData)
  },

  beforeRouteEnter (to, from, next) {
    let id = to.params.uid
    $store.dispatch('loadUserProfileData', id)
    .then(({ response, data }) => {
      if ($store.getters.appInited === null) $store.commit('setAppInited', true)
      next()
    })
    .catch(err => {
      next(false)
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (JSON.stringify(to.params) === JSON.stringify(from.params)) next()
    else {
      let id = to.params.uid
      $store.dispatch('loadUserProfileData', id)
      .then(({ response, data }) => {
        this.userResponse = response
        this.uData = data
        next()
      })
      .catch(err => {
        next(false)
      })
    }
  },

  meta () {
    let title = `${this.uData.first_name} ${this.uData.last_name}`
    let meta = [
      {
        vmid: 'og:title',
        property: 'og:title',
        content: title
      },
      {
        vmid: 'og:image',
        property: 'og:image',
        content: this.uData.photo ? this.uData.photo[400] || this.uData.photo.crop : ''
      },
      {
        vmid: 'og:image:height',
        property: 'og:image:height',
        content: 400
      },
      {
        vmid: 'og:image:width',
        property: 'og:image:width',
        content: 400
      },
      {
        vmid: 'og:type',
        property: 'og:type',
        content: 'profile'
      },
      {
        vmid: 'og:profile:first_name',
        property: 'og:profile:first_name',
        content: this.uData.first_name
      },
      {
        vmid: 'og:profile:last_name',
        property: 'og:profile:last_name',
        content: this.uData.last_name
      },
      {
        vmid: 'og:profile:gender',
        property: 'og:profile:gender',
        content: this.uData.sex == 1 ? 'male' : 'female'
      }
    ]

    if (this.uData.screen_name) meta.push({
        vmid: 'og:profile:username',
        property: 'og:profile:username',
        content: this.uData.screen_name
      })
    
    /* if (this.noIndex) meta.push({
        name: 'robots',
        content: 'none'
      }) */

    let link = [
      {
        rel: 'canonical',
        href: getLink(getLinkByData(this.cuid, -1))
      }
    ]
      
    return {
      title,
      meta,
      link
    }
  }
}
</script>

<style lang="scss">

@import '../../../sass/imports';

.profile-title {
  padding: $gut--s 0;
  text-align: center;
  &__title {
    @include text-h2;
  }
  &__online {
    margin-top: $gut--xs;
    @include text-body-s;
    color: $c--dark-secondary;
    .is-online & {
      color: $c--online;
    }
  }
}

</style>
