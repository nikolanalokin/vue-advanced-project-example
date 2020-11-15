import { tsNow } from '../../../utils'
import { formatTime } from '../../../utils/timer'

const RESEND_CODE_DELAY = 180 // секунд

export default {
  props: {
    value: Number,
    staged: Boolean
  },
  data () {
    return {
      errors: [],
      process: false,
      
      currentStage: 1,

      startTime: null,
      code: null,
      tsNowFromTimer: null
    }
  },
  watch: {
    currentStage (val, oldVal) {
      if (val != oldVal && this.staged) this.$emit('input', val)
    }
  },
  computed: {
    resendLabel () {
      return this.canResendCode ? 'Выслать код повторно' : `Выслать код повторно через ${formatTime(this.restTime)}`
    },
    restTime () {
      return this.startTime ? RESEND_CODE_DELAY + this.startTime - this.tsNowFromTimer : 1
    },
    canResendCode () {
      return this.restTime <= 0
    },
  },
  methods: {
    resetResendInterval () {
      this.startTime = tsNow()
      this.tsNowFromTimer = tsNow()
      this.interval = setInterval(() => {
        this.tsNowFromTimer = tsNow()
        if (this.canResendCode) clearInterval(this.interval)
      }, 1000)
    }
  },
  created () {
    this.currentStage = this.value
  }
}