<template>

    <transition name="fade" mode="out-in">
      <form key="form_page_1" autocomplete="off" class="form" v-if="currentStage == 1" @submit.prevent="setState(2)">
        <NForm>
          <NNotice type="info">
            <p>Введите номер телефона, используемый для входа и свои Имя и Фамилию.</p>
          </NNotice>

          <NLabelWrapper label="Номер телефона">
            <NInput
              v-model.trim="phone"
              :state="$v.group1.phone.$error ? 'error' : ''"
              :hint="getErrorText('phone')"
              :disabled="process" />
          </NLabelWrapper>

          <NLabelWrapper label="Имя и Фамилия">
            <NInput
              v-model.trim="fullName"
              :state="$v.group1.fullName.$error ? 'error' : ''"
              :hint="getErrorText('fullName')"
              :disabled="process" />
          </NLabelWrapper>

          <NNotice type="error" v-if="errors.length">
            <p v-for="item in errors" :key="item.id">{{ item.message }}</p>
          </NNotice>

          <div class="row no-wrap">
            <NBtn
              block
              color="primary"
              label="Далее"
              nativeType="submit"
              :loading="process" />
          </div>
        </NForm>
      </form>

      <form key="form_page_2" autocomplete="off" class="form" v-if="currentStage == 2" @submit.prevent="setState(3)">
        <NForm>
          <div class="row justify-center">
            <NCardWrapper
              :primary="uData.first_name"
              :urls="uData.photo"
              width="100px" />
          </div>

          <NNotice type="info">
            <p><b>{{ firstName || startCase }}</b>, если это вы, то придумайте новый пароль. В противном случае вернитесь на шаг назад.</p>
          </NNotice>

          <NLabelWrapper label="Пароль">
            <NInput
              :state="$v.group2.password.$error ? 'error' : ''"
              :hint="getErrorText('password')"
              type="password"
              v-model="password"
              :disabled="process" />
          </NLabelWrapper>

          <NLabelWrapper label="Пароль ещё раз">
            <NInput
              :state="$v.group2.passwordConfirmation.$error ? 'error' : ''"
              :hint="getErrorText('passwordConfirmation')"
              type="password"
              v-model="passwordConfirmation"
              :disabled="process" />
          </NLabelWrapper>

          <NNotice type="error" v-if="errors.length">
            <p v-for="item in errors" :key="item.id">{{ item.message }}</p>
          </NNotice>

          <div class="gutter-y-sm">
            <NBtn
              block
              color="primary"
              label="Далее"
              nativeType="submit"
              :loading="process" />

            <NBtn
              flat
              block
              color="dark-s"
              label="Назад"
              @click="setState(1)" />
          </div>
        </NForm>
      </form>
      
      <form key="form_page_3" autocomplete="off" class="form" v-if="currentStage == 3" @submit.prevent="setState(4)">
        <NForm>
          <NNotice type="info">
            <p>Введите 4 последних цифры номера телефона, который сейчас вам звонил.</p>
          </NNotice>

          <NLabelWrapper label="Код подтверждения" row>
            <NInput style="width: 60px"
              :state="$v.group3.code.$error ? 'error' : ''"
              v-model.trim="code" />
          </NLabelWrapper>

          <NNotice type="error" v-if="errors.length">
            <p v-for="item in errors" :key="item.id">{{ item.message }}</p>
          </NNotice>

          <div class="gutter-y-sm">
            <NBtn
              block
              color="primary"
              label="Завершить"
              nativeType="submit"
              :disabled="$v.group3.$invalid"
              :loading="process" />

            <NBtn
              flat
              block
              :color="canResendCode ? 'success' : 'dark-s'"
              :label="resendLabel"
              :disabled="!canResendCode"
              @click="resendCode()" />

            <NBtn
              flat
              block
              color="dark-s"
              label="Назад"
              @click="setState(2)" />
          </div>
        </NForm>
      </form>
    </transition>

</template>

<script>

import startCase from 'lodash/startCase'
import API from '../../../services/api'
import Regs from '../../../utils/regs'
import formsMixin from './formsMixin'

import { required, sameAs, minLength, numeric } from 'vuelidate/lib/validators'

const isValidTel = (value) => Regs.tel.test(String(value))
const isValidFullName = (value) => {
  let names = value ? value.split(' ') : []
  return names.length > 1 && !names.some(v => v.length < 2)
}
const isValidPassword = (value) => Regs.password.test(String(value))

export default {
  name: 'SimpleRestoreForm',
  mixins: [formsMixin],
  data() {
    return {
      uData: {},
      
      phone: null,
      fullName: null,
      password: null,
      passwordConfirmation: null,
      code: null,
    }
  },
  computed: {
    firstName () { return this.fullName ? this.fullName.split(' ')[0] : '' },
    lastName () { return this.fullName ? this.fullName.split(' ')[1] : '' },
    phoneRequest () { return this.phone.replace(/^[\+]/,'') }
  },
  methods: {
    getErrorText (field) {
      let rules = this.$v[field]
      let v

      if (this.$v.group1.$anyError) {
        if (field == 'phone') {
          if (!rules.required) v = 'Нужно ввести телефонный номер'
          else if (!rules.isValidTel) v = 'Номер телефона введен неверно'
        }
        
        if (field == 'fullName') {
          if (!rules.required) v = 'Необходимо ввести имя и фамилию'
          else if (!rules.isValidFullName) v = 'Необходимо ввести имя и фамилию'
        }
      }

      if (this.$v.group2.$anyError) {
        if (field == 'password') {
          if (!rules.required) v = 'Необходимо ввести пароль'
          else if (!rules.isValidPassword) v = 'Пароль должен содержать хотя бы одну цифру'
          else if (!rules.minLength) v = `Пароль должен содержать как минимум ${ rules.$params.minLength.min } символов`
        }

        if (field == 'passwordConfirmation') {
          if (!rules.required) v = 'Пароль нужно повторить'
          else if (!rules.sameAsPassword) v = 'Пароли должны совпадать'
        }
      }
      
      if (this.$v.group3.$anyError) {
        if (field == 'code') {
          if (!rules.required) v = 'Введите код подтвержения'
          else if (!rules.numeric) v = 'Код должен состоять из цифр'
        }
      }
      return v
    },
    setState (state) {
      this.errors = []
      this.process = false
      if (this.currentStage < state) {
        this.$v['group'+this.currentStage].$touch()
        if (!this.$v['group'+this.currentStage].$invalid) {
          if (state == 2) this.test()
          else if (state == 3) this.sendCode()
          else if (state == 4) this.confirm()
          else this.currentStage = state
        }
      } else {
        if (state == 1) {
          this.password = null
          this.passwordConfirmation = null
        }
        else if (state == 2) {
          this.code = null
        }
        this.currentStage = state
      }
    },
    test () {
      this.process = true
      API.auth.newPassword({
        phone: this.phoneRequest,
        first_name: this.firstName,
        last_name: this.lastName,
        fields: 'photo',
        // is_develop: 1
      })
      .then(response => {
        this.currentStage = 2
        this.uData = response.user
      })
      .catch(err => {
        this.errors = err.errors
      })
      .finally(() => {
        this.process = false
      })
    },
    sendCode () {
      this.process = true
      API.auth.newPassword({
        phone: this.phoneRequest,
        first_name: this.firstName,
        last_name: this.lastName,
        password: this.password,
        send_code: 1,
        // is_develop: 1
      })
      .then(response => {
        this.resetResendInterval()
        this.currentStage = 3
      })
      .catch(err => {
        this.errors = err.errors
      })
      .finally(() => {
        this.process = false
      })
    },
    confirm () {
      this.process = true
      API.auth.newPasswordConfirm({
        phone: this.phoneRequest,
        password: this.password,
        code: this.code
      })
      .then(response => {
        this.$notify({
          type: 'success',
          text: 'Пароль успешно изменен'
        })
        this.$emit('done', true)
        this.$router.replace({ name: 'index' })
        // this.$router.push({
        //   name: 'userProfile',
        //   params: {
        //     uid: response.user_id
        //   }
        // })
      })
      .catch(err => {
        this.errors = err.errors
      })
      .finally(() => {
        this.process = false
      })
    },
    resendCode () {
      API.auth.resendCode({
        phone: this.phoneRequest,
        // is_develop: 1,
      })
      .then(response => {
        this.resetResendInterval()
        this.code = null
      })
      .catch(err => {
        this.errors = err.errors
      })
    }
  },
  validations: {
    phone: {
      required,
      isValidTel
    },
    fullName: {
      required,
      isValidFullName
    },
    password: {
      required,
      isValidPassword,
      minLength: minLength(8),
    },
    passwordConfirmation: {
      sameAsPassword: sameAs('password')
    },
    code: {
      numeric,
      required
    },
    group1: ['phone','fullName'],
    group2: ['password','passwordConfirmation'],
    group3: ['code'],
  }
}

</script>