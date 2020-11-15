<template>

  <NLayout>
    <NHeader class="bg-dark">
      <NToolbar>
        <NBtn
          flat
          v-tooltip="'На главную'"
          icon="close"
          color="white"
          @click="$router.replace({ name: 'index' })" />
      </NToolbar>
    </NHeader>
    <NPageContainer>
      <NPage class="py-md row no-wrap gutter-x-xl items-center">

        <div class="width-50 column items-center justify-center gutter-y-md">
          <div class="row gutter-y-lg">
            <div class="col-12">
              
              <NField 
                label="Заголовок"
                loading
                prefix="Имя:">
                <template v-slot:before>
                  <span>before</span>
                </template>
                <template v-slot:prepend>
                  <NIcon name="edit" />
                </template>
                <template v-slot:control>
                  <span>{{ name }}</span>
                </template>
                <template v-slot:append>
                  <NIcon name="calendar" />
                </template>
                <template v-slot:after>
                  <span>after</span>
                </template>
              </NField>

            </div>
            <div class="col-12">
              
              <NInput
                placeholder="Введите текст"
                v-model="name"
                label="Поле ввода"
                prefix="prefix"
                suffix="suffix"
                counter
                maxlength="50">
                <template v-slot:before>
                  <span>before</span>
                </template>
                <template v-slot:prepend>
                  <NIcon name="edit" />
                </template>
                <template v-slot:append>
                  <NIcon name="calendar" />
                </template>
                <template v-slot:after>
                  <span>after</span>
                </template>
              </NInput>

            </div>
            <div class="col-12">
              
              <NInput
                placeholder="Введите текст"
                autogrow
                v-model="name"
                label="Самоувеличивающиеся поле ввода">
              </NInput>

            </div>
            <div class="col-12">
              
              <NSelect
                v-model="names"
                multiple
                label="Выпадающее"
                :options="$store.getters.systemMusicGenres"
                optionLabel="name"
                optionValue="id"
                optionsDense
                clearable
                useInput
                @filter="onFilter" />

            </div>
            <!-- <div class="col-12">
              <NBtn
                label="Сделать запись"
                @click="record" />
            </div> -->
          </div>

          <div class="row gutter-x-md">
            <NBtn
              color="primary"
              label="Button" />
            <NBtn
              color="success"
              label="Button" />
            <NBtn
              color="danger"
              label="Button" />
            <NBtn
              color="dark-s"
              label="Button" />
            <NBtn
              color="dark-s"
              icon="close" />
          </div>

          <div class="row gutter-x-md">
            <NBtn
              dense
              color="primary"
              label="Button" />
            <NBtn
              dense
              color="success"
              label="Button" />
            <NBtn
              dense
              color="danger"
              label="Button" />
            <NBtn
              dense
              color="dark-s"
              label="Button" />
            <NBtn
              dense
              color="dark-s"
              icon="close" />
          </div>

          <div class="row full-width">
            <NBtn
              block
              color="primary"
              label="Button" />
          </div>

          <div class="row gutter-x-md">
            <NBtn
              flat
              color="primary"
              label="Button" />
            <NBtn
              flat
              color="success"
              label="Button" />
            <NBtn
              flat
              color="danger"
              label="Button" />
            <NBtn
              flat
              color="dark-s"
              label="Button" />
            <NBtn
              flat
              color="dark-s"
              icon="close" />
          </div>

          <div class="row gutter-x-md">
            <NBtn
              flat
              dense
              color="primary"
              label="Button" />
            <NBtn
              flat
              dense
              color="success"
              label="Button" />
            <NBtn
              flat
              dense
              color="danger"
              label="Button" />
            <NBtn
              flat
              dense
              color="dark-s"
              label="Button" />
            <NBtn
              flat
              dense
              color="dark-s"
              icon="close" />
          </div>
          
          <div class="row gutter-x-md">
            <NBtn
              color="primary"
              label="Button" />
            <NBtn
              color="primary"
              label="Button"
              :loading="true" />
            <NBtn
              flat
              color="primary"
              label="Button" />
            <NBtn
              flat
              color="primary"
              label="Button"
              :loading="true" />
          </div>

          <div class="row gutter-x-md">
            <NBtn
              color="primary"
              label="Button"
              icon="add" />
            <NBtn
              flat
              color="primary"
              label="Button"
              icon="add" />
            <NBtn
              color="primary"
              label="Button"
              iconRight="add" />
            <NBtn
              flat
              color="primary"
              label="Button"
              iconRight="add" />
          </div>

          <div class="row gutter-x-md">
            <NBtn
              type="file"
              flat
              color="primary"
              label="Upload files"
              icon="upload" />
          </div>

          <div class="row gutter-x-md">
            <NBtn
              :to="{ name: 'userProfile' }"
              flat
              color="primary"
              label="Go to Profile" />
          </div>
        </div>

        <div class="gutter-y-md">
          <NInput
            v-model="date"
            mask="date"
            label="Стандартное использование">
            <template v-slot:append>
              <NIcon
                class="cursor-pointer" 
                name="calendar">
                <NMenu triggerEvent="click">
                  <NCalendar
                    v-model="date" />
                </NMenu>
              </NIcon>
            </template>
          </NInput>

          <NInput
            v-model="date"
            mask="date"
            label="Даты с сегодняшего дня">
            <template v-slot:append>
              <NIcon
                class="cursor-pointer" 
                name="calendar">
                <NMenu>
                  <NCalendar
                    v-model="date"
                    fromNow />
                </NMenu>
              </NIcon>
            </template>
          </NInput>

          <div>
            <NTextWrap :data="`dsad
asdasd
😎
sadsad
😎`" />
          </div>
        </div>

      </NPage>
    </NPageContainer>
  </NLayout>

</template>

<script>

import AudioRecorder from '../classes/AudioRecorder'

export default  {
  name: 'DevPage',
  data () {
    return {
      name: '',

      number: null,

      date: null,

      names: null,
      options: [
        {
          label: 'Первый',
          value: 1
        },
        {
          label: 'Второй',
          value: 2
        },
        {
          label: 'Третий',
          value: 3
        },
      ]
    }
  },
  watch: {
    names (val) {
      if (this.$isDevelopment) console.log(val);
    },
    date (val) {
      if (this.$isDevelopment) console.log(val);
    },
  },
  computed: {},
  methods: {
    onFilter (val, update) {
      console.log(val);
      setTimeout(update, 2000);
    },
    record () {
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        let rec = new AudioRecorder({ stream })

        rec.start()
        setTimeout(rec.stop, 3000)
      })
      .catch(err => {

      })
    }
  },
  created () {
    
  }
}

</script>