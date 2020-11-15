<template>

  <NLayout class="signin-layout">
    <NPageContainer>
      <NPage class="signin-page">
        <div class="signin-container gutter-y-xl">
          <section class="signin-title">
            <div class="signin-title__logo">
              <img draggable="false" :src="logoSrc" alt="Logo">
            </div>

            <h1 style="display: none;">LO</h1>
            <h2 class="signin-title__subtitle">DIGITAL WORLD</h2>
          </section>

          <section class="signin-forms flex flex-center">
            <div style="width: 300px;">
              <div class="n-block">
                <div class="border-bottom px-sm">
                  <NTabs
                    v-model="tab"
                    :items="tabs"
                    align="justify"
                    color="primary" />
                </div>
                <div class="pa-md">
                  <transition name="fade" mode="out-in">
                    <LoginForm v-if="tab == 'signin'" @done="onLogIn" />
                    <StartRegisterForm v-else-if="tab == 'signup'" />
                  </transition>
                </div>
              </div>
            </div>
          </section>

          <section class="signin-icons row no-wrap justify-between px-lg">
            <a href="https://play.google.com/store/apps/details?id=com.liveonce.android.lo" class="signin-app-btn" v-html="androidSVG" />
            <a href="https://apps.apple.com/us/app/lo/id1450753284?l=ru&ls=1" class="signin-app-btn" v-html="appleSVG" />
          </section>
        </div>
      </NPage>
    </NPageContainer>

    <NFooter class="signin-footer row" style="background: rgb(55, 51, 48)">
      <div class="width-container row justify-between ma-auto">
        <div class="gutter-x-md">
          <router-link :to="{ name: 'index' }" class="text-body-n text-white">О проекте</router-link>
          <router-link :to="{ path: 'index' }" class="text-body-n text-white">Блог</router-link>
          <router-link :to="{ name: 'index' }" class="text-body-n text-white">Правила</router-link>
        </div>
        <div class="row gutter-x-md">
          <span class="text-body-n text-white">LO © {{ new Date().getFullYear() }}</span>
        </div>
      </div>
    </NFooter>
  </NLayout>

</template>

<script>

import logoSrc from '../assets/img/logo.svg' // '../assets/img/lo-logo_ny_black.png'
import { getLinkByData } from '../utils'
import svgs from '../data/svgs'

export default {
  name: 'IndexPage',
  data: function () {
    return {
      logoSrc,
      appleSVG: svgs.apple_icon,
      androidSVG: svgs.android_icon,
      tab: 'signin'
    }
  },
  computed: {
    tabs () {
      return [
        {
          label: 'Вход',
          value: 'signin',
        },
        {
          label: 'Регистрация',
          value: 'signup',
        }
      ]
    }
  },
  methods: {
    onLogIn () {
      this.$router.push(getLinkByData(this.$store.getters.currentUser, -1))
    }
  },
  created () {
    if (this.$route.query.section) this.tab = this.$route.query.section
  },
  meta () {
    return {
      title: 'Цифровой мир LO',
      meta: [
        {
          vmid: 'keywords',
          name: 'keywords',
          content: 'Общение, знакомства, друзья, музыка, фильмы, сериалы, места, события, LO'
        },
        {
          vmid: 'description',
          name: 'description',
          content: 'LO – это мир в цифровом пространстве, созданный для удобства коммуникации, с собственными сервисами, объединенные в единую экосистему.'
        }
      ]
    }
  }
}

</script>
