<template>

    <transition name="fade" mode="out-in">
      <form key="form_page_1" autocomplete="off" class="form" v-if="currentStage == 1" @submit.prevent="setState(2)">
        <NForm>
          <NNotice type="info">
            <p>Пожалуйста, укажите ссылку на вашу страницу. Например, <b>https://liveonce.ru/id1</b> или <b>https://liveonce.ru/chirov</b></p>
          </NNotice>

          <NLabelWrapper label="Ссылка на страницу">
            <NInput
              prefix="https://liveonce.ru/"
              v-model.trim="link"
              :state="$v.group1.link.$error ? 'error' : ''"
              :hint="getErrorText('link')"
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
              :disabled="process" />
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
            <p><b>{{ uData.first_name | startCase }}</b>, если это вы, заполните форму ниже. В противном случае вернитесь на шаг назад.</p>
          </NNotice>

          <NLabelWrapper label="Старый номер телефона">
            <NInput
              v-model="phone"
              :state="$v.group2.phone.$error ? 'error' : ''"
              :hint="getErrorText('phone')"
              :disabled="process" />
          </NLabelWrapper>

          <NLabelWrapper label="Новый номер телефона">
            <NInput
              v-model="phoneNew"
              :state="$v.group2.phoneNew.$error ? 'error' : ''"
              :hint="getErrorText('phoneNew')"
              :disabled="process" />
          </NLabelWrapper>

          <NLabelWrapper label="Старый пароль">
            <NInput
              v-model="password"
              :state="$v.group2.password.$error ? 'error' : ''"
              :hint="getErrorText('password')"
              type="password"
              :disabled="process" />
          </NLabelWrapper>

          <NLabelWrapper label="Старый e-mail">
            <NInput
              v-model="email"
              :state="$v.group2.email.$error ? 'error' : ''"
              :hint="getErrorText('email') || '* необязательное поле'"
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
              :disabled="process" />

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
            <p>Сделайте пожалуйста селфи на фоне этой заявки, чтобы мы могли удостовериться, что это точно вы</p>
          </NNotice>

          <div class="row justify-center">
            <NBtn
              type="file"
              color="primary"
              :label="!hash ? 'Загрузить фото' : 'Загружено'"
              accept=".png,.jpg,.jpeg"
              @select-files="uploadPhoto"
              :disabled="!!hash" />
          </div>

          <NNotice type="error" v-if="$v.group3.$error">
            <p>{{ getErrorText('file') }}</p>
          </NNotice>

          <div class="gutter-y-sm">
            <NBtn v-if="!!hash"
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
              @click="setState(2)" />
          </div>
        </NForm>
      </form>
      
      <form key="form_page_4" autocomplete="off" class="form" v-if="currentStage == 4" @submit.prevent="setState(5)">
        <NForm>
          <NNotice type="info">
            <p>Введите 4 последних цифры номера телефона, который сейчас вам звонил.</p>
          </NNotice>

          <NLabelWrapper label="Код подтверждения" row>
            <NInput style="width: 50px;"
              :state="$v.group4.code.$error ? 'error' : ''"
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
              :disabled="$v.group4.$invalid"
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
              @click="setState(3)" />
          </div>
        </NForm>
      </form>
      
      <form key="form_page_5" v-if="currentStage == 5">
        <NForm>
          <NNotice type="info">
            <p>Спасибо!<br>Ваша заявка <b>№{{ requestId }}</b> принята, мы рассмотрим её в ближайшее время, о результате решения мы сообщим в смс</p>
          </NNotice>

          <div class="row">
            <NBtn
              flat
              block
              color="dark-s"
              label="На главную"
              :to="{ name: 'index' }" />
          </div>
        </NForm>
      </form>
    </transition>

</template>

<script>

import API from '../../../services/api'
import Regs from '../../../utils/regs'
import formsMixin from './formsMixin'

import { required, sameAs, minLength, numeric, email } from 'vuelidate/lib/validators'
import { getIdByOwnerIdOrScreenName, getFormDataObj } from '../../../utils'
import axios from 'axios'

const isValidTel = (value) => {
  return Regs.tel.test(String(value));
}

export default {
  name: 'RestoreForm',
  mixins: [formsMixin],
  data() {
    return {
      userId: null,
      uData: {},
      requestId: null,
      uniqueId: null,
      uploadUrl: null,
      hash: null,

      link: null,
      phone: null,
      phoneNew: null,
      email: null,
      password: null,
      file: null,
      code: null,

      uid: null,
    }
  },
  methods: {
    getErrorText (field) {
      let rules = this.$v[field]
      let v
      
      if (this.$v.group1.$anyError) {
        if (field == 'link') {
          if (!rules.required) v = 'Необходимо ввести ссылку'
        }
      }
      
      if (this.$v.group2.$anyError) {
        if (field == 'phone') {
          if (!rules.required) v = 'Нужно ввести телефонный номер'
          else if (!rules.isValidTel) v = 'Номер телефона введен неверно'
        }

        if (field == 'phoneNew') {
          if (!rules.required) v = 'Нужно ввести телефонный номер'
          else if (!rules.isValidTel) v = 'Номер телефона введен неверно'
        }

        if (field == 'email') {
          if (!rules.email) v = 'Неверный формат электронной почты'
        }
        
        if (field == 'password') {
          if (!rules.required) v = 'Необходимо ввести пароль'
          else if (!rules.minLength) v = `Пароль должен содержать как минимум ${ rules.$params.minLength.min } символов`
        }
      }
      
      if (this.$v.group3.$anyError) {
        if (field == 'file') {
          if (!rules.required) v = 'Выберите файл'
        }
      }
      
      if (this.$v.group4.$anyError) {
        if (field == 'code') {
          if (!rules.required) v = 'Введите код подтвержения'
          else if (!rules.numeric) v = 'Код должен состоять из цифр'
        }
      }

      return v
    },
    setState (state) {
      this.error = []
      this.process = false
      if (this.currentStage < state) {
        this.$v['group'+this.currentStage].$touch()
        if (!this.$v['group'+this.currentStage].$invalid) {
          if (state == 2) this.getUser()
          else if (state == 3) this.firstStep()
          else if (state == 4) this.sendCode()
          else if (state == 5) this.confirm()
          else this.currentStage = state
        }
      } else {
        if (state == 1) {
          this.phone = null
          this.phoneNew = null
          this.password = null
          this.email = null
        }
        else if (state == 2) {
          this.hash = null
        }
        else if (state == 3) {
          this.code = null
        }
        this.currentStage = state
      }
    },
    getUser () {
      let route = this.$router.resolve(this.link).resolved
      if (route.params.uid || route.params.screen_name) {
        getIdByOwnerIdOrScreenName({
          oid: route.params.screen_name || 'id' + route.params.uid,
          fields: 'photo'
        })
        .then(response => {
          this.userId = response.id
          this.uData = response.data
          this.currentStage = 2
        })
        .catch(err => {
          this.errors = err.errors
        })
      }
    },
    firstStep () {
      this.process = false
      
      API.auth.restore({
        user_id: this.uData.id,
        phone: this.phone,
        phone_new: this.phoneNew,
        email: this.email || '',
        password: this.password
      })
      .then(response => {
        this.requestId = response.request_id
        this.uniqueId = response.unique_id
        this.uploadUrl = response.upload_url
        this.$emit('request-id', this.requestId)
        this.currentStage = 3
      })
      .catch(err => {
        this.errors = err.errors
      })
      .finally(() => {
        this.process = false
      })
    },
    async uploadPhoto (files) {
      this.file = files[0]
      this.process = true
      try {
        let response = await axios({
          method: 'post',
          url: this.uploadUrl.replace('http', 'https'),
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: getFormDataObj({
            upload_file: this.file,
            request_id: this.requestId,
            unique_id: this.uniqueId
          })
        })
        this.hash = response.data.data.response
      } catch (err) {
        this.errors = err.errors
      } finally {
        this.process = false
      }
    },
    sendCode () {
      this.process = false

      API.auth.restoreSavePhoto({
        hash: this.hash,
        // is_develop: 1
      })
      .then(response => {
        this.resetResendInterval()
        this.currentStage = 4
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
      
      API.auth.restoreConfirm({
        request_id: this.requestId,
        unique_id: this.uniqueId,
        code: this.code
      })
      .then(response => {
        this.$notify({
          type: 'success',
          text: 'Процесс успешно завершен'
        })
        this.$emit('done', true)
        // this.$router.replace({ name: 'index' })
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
        phone: this.phoneNew,
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
    link: {
      required
    },
    phone: {
      required,
      isValidTel
    },
    phoneNew: {
      required,
      isValidTel
    },
    email: {
      email,
    },
    password: {
      required,
      minLength: minLength(8),
    },
    file: {
      required
    },
    code: {
      required
    },
    group1: ['link'],
    group2: ['phone','phoneNew','email','password'],
    group3: ['file'],
    group4: ['code'],
  }
}

</script>