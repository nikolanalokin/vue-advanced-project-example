<template>

  <NModalBox
    centered
    name="after-registration"
    size="n"
    ref="dialog"
    @open="onopen"
    :closeBtn="stage == 4">
    <!-- persistent -->

    <template v-if="stage == 2">
      <div class="modal-box__header">
        <div class="modal-box__title">Добавление фотографии</div>
      </div>
    </template>

    <div class="pa-lg" v-if="stage == 1">
      <!-- <div class="flex flex-center">
        <img draggable="false" :src="logoSrc" alt="LO" height="50">
      </div> -->

      <p class="text-h2 text-center">Добро пожаловать<br>в цифровой мир LO!</p>
    </div>

    <div class="pa-lg gutter-y-lg" v-if="stage == 2">
      <p class="text-body-l text-center">Установите свою фотографию, чтобы друзья<br>могли вас найти!</p>

      <div class="flex flex-center">
        <NAvatar
          type="user"
          size="120">
          <template v-slot:actions>
            <NBtn
              flat
              round
              size="lg"
              color="white"
              icon="upload"
              @click="setAvatar" />
          </template>
        </NAvatar>
      </div>
    </div>

    <div class="pa-lg" v-if="stage == 3">
      <NForm>
        <p class="text-body-l text-center">Укажите свой <b>день рождения</b> и <b>город</b>. Эта информация необходима для вывода контента.</p>
        <!-- <NNotice type="info">
          <p>Укажите свой <b>день рождения</b> и <b>город</b>. Эта информация необходима для вывода контента.</p>
        </NNotice> -->

        <NLabelWrapper label="День рождения" row>
          <NInput class="width-50"
            v-model="birthday"
            mask="date"
            hint="В формате ДД.ММ.ГГГГ">
            <template v-slot:append>
              <NIcon
                class="cursor-pointer" 
                name="calendar">
                <NMenu triggerEvent="click">
                  <NCalendar
                    v-model="birthday" />
                </NMenu>
              </NIcon>
            </template>
          </NInput>
        </NLabelWrapper>

        <NLabelWrapper label="Город">
          <NSelect
            use-input
            emit-value
            map-options
            v-model="location"
            :options="locationOptions"
            @filter="onLocationsFilter" />
        </NLabelWrapper>
      </NForm>
    </div>

    <div class="pa-lg gutter-y-sm" v-if="stage == 4">
      <p class="text-h2 text-center">Поздравляем!</p>
      <p class="text-body-l text-center">Теперь вы стали частью цифрового мира!</p>
    </div>

    <!-- <NDivider /> -->

    <div class="px-md pt-sm pb-md">
      <div class="row justify-center gutter-x-sm">
        <NBtn v-if="stage > 1 && stage < 4"
          flat
          color="dark-s"
          label="Назад"
          @click="prev" />
        <NBtn
          color="primary"
          :label="stage == 4 ? 'Завершить' : 'Далее'"
          :disabled="nextDisabled"
          :loading="processing"
          @click="next" />
      </div>
    </div>

  </NModalBox>

</template>

<script>

import API from '../../services/api'
import * as types from '../../store/mutation-types'
import { required } from 'vuelidate/lib/validators'
import logoSrc from '../../assets/img/logo-simple-black.svg'
import events from '../../utils/bus'

export default {
  name: 'ModalAfterRegister',
  data () {
    return {
      logoSrc,

      stage: 1,
      
      birthday: null,
      
      location: null,
      locationOptions: [],

      processing: false,
    }
  },
  computed: {
    nextDisabled () { return this.stage == 2 || this.stage == 3 && this.$v.$invalid }
  },
  methods: {
    onopen () {
      this.stage = 1
    },
    close () {
      this.$refs.dialog.hide()
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

    setAvatar () {
      this.$store.dispatch(types.MODAL_OPEN, {
        name: 'upload-set-image',
        payload: {
          type: 'avatar',
          object: 'user',
          id: this.$uid,
        },
        cb: this.next
      })
    },

    prev () {
      if (this.stage > 1) this.stage--
    },
    next () {
      if (this.stage == 3) {
        this.save()
        .then(() => {
          this.stage++
        })
      }
      else if (this.stage < 4) this.stage++
      else if (this.stage == 4) this.done()
    },
    
    async save () {
      this.processing = true
      try {
        await API.users.edit({
          bdate: this.birthday
        })

        let response = await API.users.editContacts({
          city_id: this.location ? this.location.city.id : '',
        })

        if (response.response == 1) {
          this.$notify({
            type: 'success',
            text: 'Данные успешно сохранены'
          })
        } else {
          this.$notify({
            type: 'success',
            text: 'Не удалось сохранить, проверьте верность указанной информации'
          })
          throw new Error(response)
        }
      } catch (err) {
        this.$notify({
          type: 'error',
          text: 'Не удалось сохранить, проверьте верность указанной информации'
        })
      } finally {
        this.processing = false
      }
    },

    done () {
      this.$store.dispatch(types.USER_LOAD_SELF_DATA)
      events.$emit('after-registration:complete')
      this.close()
    },
  },
  validations: {
    birthday: { required },
    location: { required },
  }
}

</script>