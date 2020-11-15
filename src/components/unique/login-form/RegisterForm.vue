<template>

  <transition name="fade" mode="out-in">
    <form key="form_page_1" autocomplete="off" class="form" v-if="currentStage == 1" @submit.prevent="setState(2)">
      <NForm>
        <NNotice type="info">
          <p><b>{{ firstName | startCase }}</b>, придумайте сложный пароль, состоящий из символов и цифр, длиной не менее 8 символов.</p>
        </NNotice>

        <NLabelWrapper label="Пароль">
          <NInput
            type="password"
            v-model="password"
            :state="$v.group1.password.$anyError ? 'error' : ''"
            :hint="getErrorText('password')" />
        </NLabelWrapper>

        <NLabelWrapper label="Повторите пароль">
          <NInput
            type="password"
            v-model="passwordConfirmation"
            :state="$v.group1.passwordConfirmation.$anyError ? 'error' : ''"
            :hint="getErrorText('passwordConfirmation')" />
        </NLabelWrapper>

        <div class="gutter-y-sm">
          <NBtn
            block
            color="primary"
            label="Далее"
            nativeType="submit" />

          <NBtn
            flat
            block
            color="dark-s"
            label="Назад"
            @click="$router.back()" />
        </div>
      </NForm>
    </form>

    <form key="form_page_2" autocomplete="off" class="form" v-if="currentStage == 2" @submit.prevent="setState(3)">
      <NForm>
        <NNotice type="info">
          <p><b>{{ firstName | startCase }}</b>, для защиты вашей страницы мы совершим бесплатный звонок-сброс</p>
        </NNotice>

        <NLabelWrapper label="Страна">
          <NSelect
            :use-input="!country"
            emit-value
            map-options
            clearable
            v-model="country"
            :options="countryOptions"
            @filter="onCountryFilter"
            autocomplete="no"
            popupContentClass="registration-select-country-popup"
            :disabled="process">

            <template v-slot:option="scope">
              <NItem
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                class="no-border-radius"
                :title="scope.opt.value.name">
                <NItemSection side>
                  <img :src="scope.opt.value.icon" width="20" height="20" alt="" />
                </NItemSection>
                <NItemSection>
                  <NItemLabel lines="1">{{ scope.opt.value.name }}</NItemLabel>
                </NItemSection>
              </NItem>
            </template>

            <template v-slot:selected v-if="country">
              <div class="row no-wrap items-center gutter-x-md px-sm">
                <img :src="country.icon" width="20" height="20" alt="" />
                <span class="text-body-n">{{ country.name }}</span>
              </div>
            </template>

          </NSelect>
        </NLabelWrapper>

        <NLabelWrapper label="Номер телефона">
          <NInput
            v-model.trim="phone"
            :prefix="country && `+${country.phone}`"
            :state="$v.group2.phone.$anyError ? 'error' : ''"
            :hint="getErrorText('phone')"
            :disabled="process" />
        </NLabelWrapper>

        <NNotice type="error" v-if="errors.length">
          <p v-for="item in errors" :key="item.id">{{ item.message }}</p>
        </NNotice>

        <div class="gutter-y-sm">
          <NBtn
            block
            color="primary"
            label="Подтвердить"
            nativeType="submit"
            :loading="process" />

          <NBtn
            flat
            block
            color="dark-s"
            label="Назад"
            :disabled="process"
            @click="setState(1)" />
        </div>
      </NForm>
    </form>

    <form key="form_page_3" autocomplete="off" class="form" v-if="currentStage == 3 || currentStage == 4" @submit.prevent="setState(4)">
      <NForm>
        <NNotice type="info">
          <p><b>{{ firstName | startCase }}</b>, введите последние 4 цифры звонящего номера</p>
        </NNotice>

        <NLabelWrapper label="Код подтверждения" row>
          <NInput style="width: 60px"
            :state="$v.group3.code.$anyError ? 'error' : ''"
            v-model.trim="code"
            :disabled="process" />
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
            label="Изменить номер телефона"
            @click="setState(2)" />
        </div>
      </NForm>
    </form>
  </transition>

</template>

<script>

import API from '../../../services/api'
import Regs from '../../../utils/regs'
import * as types from '../../../store/mutation-types'

import { required, sameAs, minLength, alpha, numeric } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

import formsMixin from './formsMixin'

const isValidTel = (value) => Regs.tel.test(String(value))
const isValidPassword = (value) => Regs.password.test(String(value))
const isTrue = (value) => value == true

/* const ERRORS = {
  8: 'Missing a required fields: `name`, `lastname`, `gender`',
  13: 'Unknown field:  `is_develop`',
  20: 'Mobile code service disabled (отправка отключена со стороны нашего api)',
  21: 'Mobile code service error (ошибка на сервисе смс сообщений)',
  100: 'Invalid first name',
  101: 'Invalid last name',
  102: 'Invalid country',
  103: 'Invalid city',
  104: 'Invalid sex',
  105: 'Invalid password',
  106: 'Invalid phone',
  107: 'This phone number already exists',
  108: 'This code is invalid'
} */

export default {
  name: 'RegisterForm',
  mixins: [formsMixin],
  data() {
    return {
      refId: null,

      country: null,
      countryOptions: [],
      countryOptionsBase: [],

      password: null,
      passwordConfirmation: null,
      phone: null,
    }
  },
  computed: {
    ...mapGetters([
      'registerData'
    ]),
    firstName () {
      return this.registerData.firstName
    },
    fullPhone () {
      return `+${this.country.phone}${this.phone || ''}`
    }
  },
  methods: {
    getErrorText (field) {
      let rules = this.$v[field]
      let v
      if (this.$v.group1.$anyError) {
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

      if (this.$v.group2.$anyError) {
        if (field == 'phone') {
          if (!rules.required) v = 'Нужно ввести номер телефона'
          else if (!rules.isValidTel) v = 'Номер телефона введен неверно'
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
    onCountryFilter (val, update) {
      if (val.length > 0) {
        update(() => {
          this.countryOptions = this.countryOptionsBase.filter(v => v.value.name.toLowerCase().indexOf(val) > -1)
        })
        return
      } else {
        update(() => {
          this.countryOptions = [].concat(this.countryOptionsBase)
        })
        return
      }
    },
    setState (state) {
      this.process = false
      this.errors = []
      if (this.currentStage < state) {
        this.$v['group'+this.currentStage].$touch()
        if (!this.$v['group'+this.currentStage].$invalid) {
          if (state == 2) {
            this.$store.commit(types.REGISTER_SET_DATA, { key: 'password', value: this.password })
          }
          
          if (state == 3) {
            this.$store.commit(types.REGISTER_SET_DATA, { key: 'phone', value: this.phone })
            this.$store.dispatch(types.MODAL_OPEN, {
              name: 'confirm',
              payload: {
                text: `${this.firstName}, ваш номер ${this.fullPhone}?`,
                type: 'success',
                actionLabel: 'Да',
                cancelLabel: 'Нет'
              },
              cb: (isDone) => {
                if (isDone) this.signup()
              }
            })
          } else if (state == 4) {
            this.signupConfirm()
          } else {
            this.currentStage = state
          }
        }
      } else {
        this.currentStage = state
        this.$emit('done', false)
      }
    },
    signup () {
      this.process = true

      let { firstName, lastName, country, city, sex, password } = this.registerData
      
      API.auth.signup({
        first_name: firstName,
        last_name: lastName,
        country: country.id,
        city: city.id,
        sex,
        phone: this.fullPhone,
        password,
        referrer_id: this.refId,
        // is_develop: 1
      })
      .then(response => {
        this.currentStage = 3
        this.resetResendInterval()
      })
      .catch(err => {
        this.errors = err.errors
      })
      .finally(() => {
        this.process = false
      })
    },
    signupConfirm () {
      this.process = true

      API.auth.signupConfirm({
        phone: this.fullPhone,
        code: this.code,
      })
      .then(response => {
        this.currentStage = 4
        this.$emit('done', true)
        this.$store.commit(types.REGISTER_CLEAR_DATA)
        this.$store.dispatch(types.AUTH_REGISTER, response.data)
        this.$store.dispatch(types.USER_INIT)
        this.$router.push({
          name: 'userProfile',
          params: {
            uid: response.data.user_id
          }
        })
        this.$store.dispatch(types.MODAL_OPEN, 'after-registration')
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
        phone: this.fullPhone,
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
  created () {
    this.refId = this.$route.query.ref
    this.currentStage = this.value
    this.country = this.registerData.country
    this.countryOptions = [{ label: this.registerData.country.name, value: this.registerData.country }]
    API.database.getCountries({})
    .then(response => {
      this.countryOptionsBase = response.items.map(v => {
        return { label: v.name, value: v}
      })
      this.countryOptions = [].concat(this.countryOptionsBase)
    })
  },
  validations: {
    password: {
      required,
      isValidPassword,
      minLength: minLength(8),
    },
    passwordConfirmation: {
      required,
      sameAsPassword: sameAs('password')
    },
    phone: {
      required,
      isValidTel
    },
    code: {
      numeric,
      required
    },
    group1: ['password','passwordConfirmation'],
    group2: ['phone'],
    group3: ['code'],
  },
}

</script>