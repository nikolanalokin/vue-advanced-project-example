<template>

  <NLayout class="recovery-layout">
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
      <NPage class="recovery-page flex flex-center">
        <div style="width: 300px;">
          <h1 v-if="requestId" class="text-h2 text-center mb-xl">Заявка №{{ requestId }}</h1>

          <div class="n-block">
            <div class="n-block__header">
              <span>Восстановление пароля</span>
            </div>
            <div class="n-block__close">
              <NIcon
                class="cursor-pointer"
                color="white"
                v-tooltip.top="'Прервать восстановление'"
                name="close"
                @click="$router.replace({ name: 'index' })" />
            </div>
            <!-- <NProgressBar
              style="height: 6px"
              color="primary"
              :value="stage - 1"
              :max="stageNames.length" /> -->
            <div class="n-block__body">
              <SimpleRestoreForm v-if="isSimple"
                staged
                v-model="stage"
                @done="onDone" />
              <RestoreForm v-else
                staged
                v-model="stage"
                @request-id="requestId = $event"
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

export default {
  name: 'RestoreUserDataPage',
  data () {
    return {
      requestId: null,
      done: false,
      stage: 1
    }
  },
  computed: {
    isSimple () {
      return this.$route.query.type == 'simple'
    },
    stageNames () {
      return this.isSimple ? [
        'Данные',
        'Новый пароль',
        'Подтверждение',
      ] : [
        'Ваша страница',
        'Данные',
        'Заявка',
        'Подтверждение'
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
      const answer = window.confirm('Вы уверены что хотите вернуться на главную страницу и прервать восстановление пароля? Прогресс будет утерян.')
      if (answer) {
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
          content: 'Восстановление доступа к аккаунту'
        }
      ]
    }
  }
}

</script>