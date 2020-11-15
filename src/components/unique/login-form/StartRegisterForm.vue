<template>

  <form key="register" autocomplete="off" class="form" @submit.prevent="next()">
    <NForm>
      <NLabelWrapper label="Имя">
        <NInput
          v-model.trim="firstName"
          :hint="getErrorText('firstName')"
          :state="$v.firstName.$error ? 'error' : ''" />
      </NLabelWrapper>

      <NLabelWrapper label="Фамилия">
        <NInput
          v-model.trim="lastName"
          :hint="getErrorText('lastName')"
          :state="$v.lastName.$error ? 'error' : ''" />
      </NLabelWrapper>

      <NLabelWrapper label="Город">
        <NSelect
          :use-input="!location"
          emit-value
          map-options
          clearable
          placeholder="Начните вводить город"
          v-model="location"
          :options="locationOptions"
          @filter="onLocationsFilter"
          :hint="getErrorText('location')"
          :state="$v.location.$error ? 'error' : ''"
          autocomplete="no" />
      </NLabelWrapper>

      <NLabelWrapper label="Пол"
        :hint="getErrorText('sex')"
        :state="$v.sex.$error ? 'error' : ''">
        <div class="width-100">
          <NFilter
            align="justify"
            :items="[
              { label: 'Мужской', value: '1'},
              { label: 'Женский', value: '2'}
            ]"
            v-model="sex" />
        </div>
      </NLabelWrapper>

      <div class="text-center">
        <!-- <span class="link" @click.prevent.stop="open('licence')">Лицензионным соглашением</span> и согласен с <span class="link" @click.prevent.stop="open('terms')">Правилами пользования сайтом</span> -->
        <span class="text-body-n">Нажимая кнопку Продолжить, вы принимаете <span class="link" @click.prevent.stop="open('licence')">Условия</span> и <span class="link" @click.prevent.stop="open('terms')">Политику использования данных</span></span>
      </div>

      <div class="row justify-center">
        <NBtn
          rounded
          hoverLabel
          color="primary"
          label="Продолжить"
          iconRight="arrow_right"
          nativeType="submit" />
      </div>
    </NForm>
  </form>

</template>

<script>

import { startCase } from 'lodash'
import API from '../../../services/api'
import * as types from '../../../store/mutation-types'
import Regs from '../../../utils/regs'

import { required, sameAs, minLength, alpha, numeric, email } from 'vuelidate/lib/validators'

const isTrue = (value) => value == true
const isName = (value) => Regs.name.test(String(value))

export default {
  name: 'StartRegisterForm',
  data() {
    return {
      refId: null,

      firstName: null,
      lastName: null,
      location: null,
      sex: null,

      locationOptions: [],

      done: false
    }
  },
  methods: {
    startCase,
    getErrorText (field) {
      let rules = this.$v[field]
      let v
      if (this.$v.$anyError) {
        if (field == 'firstName') {
          if (!rules.required) v = 'Введите имя'
          else if (!rules.minLength) v = `Имя должно содержать более ${rules.$params.minLength.min}х символов`
          else if (!rules.isName) v = 'Имя должно состоять из буквенных символов'
        }

        if (field == 'lastName') {
          if (!rules.required) v = 'Введите фамилию'
          else if (!rules.minLength) v = `Фамилия должна содержать более ${rules.$params.minLength.min}х символов`
          else if (!rules.isName) v = 'Фамилия должна состоять из буквенных символов'
        }

        if (field == 'location') {
          if (!rules.required) v = 'Выберите город'
        }

        if (field == 'sex') {
          if (!rules.required) v = 'Выберите пол'
        }
      }
      return v
    },
    onLocationsFilter (val, update) {
      if (val.length > 2) {
        API.database.getCountriesCities({
          q: val,
          count: 10
        })
        .then(response => {
          update(() => {
            this.locationOptions = !!response.items ? response.items.map(item => { return { value: item, label: `${item.country.name}, ${item.city.name}` } }) : []
          })
        })
        .catch(error => {
          console.warn(error);
          return
        })
      } else {
        update()
        return
      }
    },
    next () {
      this.$v.$touch()

      if (this.$v.$invalid) return false

      this.$store.commit(types.REGISTER_SET_DATA, { value: {
        firstName: this.firstName,
        lastName: this.lastName,
        location: this.location,
        country: this.location.country,
        city: this.location.city,
        sex: this.sex
      }})

      this.$router.push({ name: 'register', query: this.$route.query })
    },
    open (section) {
      this.$store.dispatch(types.MODAL_OPEN, {
        name: 'terms',
        payload: section
      })
    }
  },
  created () {
    this.refId = this.$route.query.ref
  },
  validations: {
    firstName: {
      required,
      isName,
      minLength: minLength(2)
    },
    lastName: {
      required,
      isName,
      minLength: minLength(2)
    },
    location: {
      required
    },
    sex: {
      required
    }
  }
}

</script>