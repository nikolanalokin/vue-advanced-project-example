<template>

  <div class="notice" :class="classObj" @click="onClick">
    <div class="row no-wrap">
      <div v-if="icon" class="pr-md">
        <NSVG :name="icon" :color="type" />
      </div>
      <div class="column">
        <div v-if="title" class="text-body-n pb-xs"><b>{{ title }}</b></div>
        <slot>
          <div class="text-body-n">{{ body }}</div>
        </slot>
      </div>
    </div>
    
  </div>

</template>

<script>

export default {
  name: 'NNotice',
  props: {
    type: {
      type: String,
      default: ''
    },
    title: String,
    body: String,
    icon: String,
    clickToClose: Boolean
  },
  computed: {
    classObj: function () {
      return {
        error: this.type == 'danger' || this.type == 'error',
        success: this.type == 'confirm' || this.type == 'success',
        warning: this.type == 'warning' || this.type == 'warn',
        info: this.type == 'info'
      }
    }
  },
  methods: {
    onClick () {
      if (this.clickToClose) {
        
      }
    }
  }
}

</script>