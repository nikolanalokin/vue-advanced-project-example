<template>

  <form key="login" @submit.prevent="auth">
    <NForm>
      <NInput
        label="Номер телефона"
        v-model="login"
        :disabled="processing"
        :hint="getErrorText('login')"
        :state="$v.login.$anyError ? 'error' : ''" />

      <NInput
        label="Пароль"
        type="password"
        v-model="password"
        :disabled="processing"
        :hint="getErrorText('password')"
        :state="$v.password.$anyError ? 'error' : ''" />

      <NNotice v-if="errors.length" type="error">
        <p v-for="item in errors" :key="item.code">{{ item.message }}</p>
      </NNotice>

      <div class="gutter-y-sm">
        <NBtn
          nativeType="submit"
          block
          color="primary"
          label="Войти"
          :loading="processing" />

        <NBtn
          flat
          block
          color="dark-s"
          label="Не можете войти?"
          @click="onRestoreClick" />
      </div>
    </NForm>
  </form>

</template>

<script>

import Regs from '../../../utils/regs'
import API from '../../../services/api'
import * as types from '../../../store/mutation-types'
import { required } from 'vuelidate/lib/validators'

const isValidTel = (value) => { return Regs.tel.test(String(value)) }

export default {
  name: 'LoginForm',
  data() {
    return {
      login: '',
      password: '',

      errors: [],

      processing: false
    }
  },
  methods: {
    getErrorText (field) {
      let rules = this.$v[field]
      let v
      if (this.$v.$anyError) {
        if (field == 'login') {
          if (!rules.required) v = 'Нужно ввести номер телефона'
          else if (!rules.isValidTel) v = 'Неверный формат номера телефона'
        }

        if (field == 'password') {
          if (!rules.required) v = 'Необходимо ввести пароль'
        }
      }
      return v
    },
    async auth () {
      this.errors = []

      this.$v.$touch()
      if (this.$v.$invalid) return false

      this.processing = true
      try {
        let { login, password } = this
        login = login.replace(/^[\+]/,'')

        await this.$store.dispatch(types.AUTH_LOG_IN, { login, password })
        await this.$store.dispatch(types.AUTH_INIT)
        await this.$store.dispatch(types.USER_INIT)

        this.$emit('done')

        this.$notify({
          type: 'info',
          text: 'Рады что вы с нами, хорошего дня!'
        })
      } 
      catch (err) {
        this.errors = err.errors
      } 
      finally {
        this.processing = false
      }
    },
    onRestoreClick () {
      this.$store.dispatch(types.MODAL_OPEN, {
        name: 'confirm',
        payload: {
          text: 'У вас есть доступ к номеру телефона который был привязан к странице?',
          type: 'success',
          actionLabel: 'Да',
          cancelLabel: 'Нет'
        },
        cb: (isDone) => {
          this.$router.push({ name: 'restore', query: { type: isDone ? 'simple' : 'full' } })
        }
      })
    }
  },
  validations: {
    login: { required, isValidTel },
    password: { required },
  }
}

</script>