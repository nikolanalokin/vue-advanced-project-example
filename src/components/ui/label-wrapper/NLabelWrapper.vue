<template>

  <div class="n-label-wrapper column" :class="stateClasses">
    <div :class="{ 
      'row no-wrap justify-between gutter-x-sm': row,
      'flex-max gutter-y-sm': !row
    }">
      <div class="text-body-n-bold" :style="{ 'padding-top': row ? '6px' : '' }">{{ label }}</div>
      <slot />
    </div>
    <div v-if="hint" class="n-field__bottom row items-start">
      <div class="n-field__messages col">
        <div>{{ hint }}</div>
      </div>
    </div>
  </div>

</template>

<script>

import inputState from '../../../mixins/inputState'

export default {
  name: 'NLabelWrapper',
  mixins: [ inputState ],
  props: {
    label: String,
    hint: String,
    row: Boolean
  },
  data () {
    return {

    }
  },
}

</script>