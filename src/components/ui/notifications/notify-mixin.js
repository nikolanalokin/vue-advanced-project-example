import debug from 'debug'
const logger = debug('notify:mixin')

import Timer from "../../../utils/timer"

const _defs = {
  delay: 300,
  interval: 200,
  duration: 6000
}

export default {
  props: {
    duration: {
      type: Number,
      default: _defs.duration
    }
  },
  data () {
    return {
      timerWidth: 0
    }
  },
  methods: {
    close () {
      logger('close')
      this.timer.stop()
      this.__destroy()
    },
    timerPause () {
      logger('timerPause')
      this.timer.pause()
    },
    timerPlay () {
      logger('timerPlay')
      this.timer.start()
    },
    
    __onTimerTick () {
      this.timerWidth = this.timer.pastDuration / this.duration * 100
    },
    __onTimerEnd () {
      this.__destroy()
    },
    __destroy () {
      this.timer = null
      this.$emit('destroy', this.data.id)
    }
  },
  created () {
    this.timer = new Timer({
      duration: this.duration,
      interval: _defs.interval,
      runCallbackOnStart: false,
      alwaysRunCallback: false,
      autoStart: false,
      callback: this.__onTimerEnd, 
      ontick: this.__onTimerTick,
    })
  },
}