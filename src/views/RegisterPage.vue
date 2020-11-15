<template>

  <NLayout class="register-layout">
    <NHeader>
      <NToolbar class="bg-dark">
        <div class="width-container mx-auto full-height row items-center justify-between">
          <div class="col-2 row">
            <div class="header__logo">
              <img draggable="false" src="../assets/img/logo.svg" class="logo" alt="">
            </div>
          </div>
        </div>
      </NToolbar>
    </NHeader>
    
    <NPageContainer>
      <NPage class="register-page flex flex-center">
        <div style="width: 300px;">
          <div class="n-block">
            <div class="n-block__header">
              <span>Регистрация</span>
            </div>
            <div class="n-block__close">
              <NIcon
                class="cursor-pointer"
                color="white"
                v-tooltip.top="'Прервать регистрацию'"
                name="close"
                @click="$router.replace({ name: 'index' })" />
            </div>
            <div class="n-block__body">
              <RegisterForm
                staged
                v-model="stage"
                @done="onDone" />
            </div>
          </div>
        </div>
      </NPage>

      <NFooter class="row" style="background: rgb(55, 51, 48)">
        <div class="width-container row justify-between ma-auto">
          <div class="gutter-x-md">
            <router-link :to="{ name: 'index' }" class="text-body-n text-white">О проекте</router-link>
            <router-link :to="{ path: 'index' }" class="text-body-n text-white">Блог</router-link>
            <router-link :to="{ name: 'index' }" class="text-body-n text-white">Правила</router-link>
          </div>
          <span class="text-body-n text-white">LO © {{ new Date().getFullYear() }}</span>
        </div>
      </NFooter>
    </NPageContainer>
  </NLayout>

</template>

<script>
import * as types from '../store/mutation-types'

export default {
  name: 'RegisterPage',
  data () {
    return {
      done: false,
      stage: 1
    }
  },
  computed: {
    stageNames () {
      return [
        'Пароль',
        'Номер телефона',
        'Код подтверждения',
      ]
    }
  },
  methods: {
    onDone (isDone) {
      this.done = isDone
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.done) {
      next()
    } else {
      const answer = window.confirm('Вы уверены что хотите вернуться на главную страницу и прервать регистрацию? Введенные данные будут утеряны.')
      if (answer) {
        this.$store.commit(types.REGISTER_CLEAR_DATA)
        next()
      } else {
        next(false)
      }
    }
  },
  meta () {
    return {
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: 'Регистрация'
        }
      ]
    }
  }
}

</script>