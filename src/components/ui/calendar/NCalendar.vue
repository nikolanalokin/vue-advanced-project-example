<template>
  
  <div class="n-calendar">
    <template v-if="currentMode == 'day'">
      <div class="n-calendar__header row no-wrap items-center justify-between">
        <NBtn
          flat
          color="dark-s"
          icon="arrow_left"
          @click="setPrev()" />

        <div class="gutter-x-sm">
          <NBtn
            flat
            color="primary"
            :label="currentMonthString"
            @click="setSelectMode('month')" />

          <NBtn
            flat
            color="primary"
            :label="currentYear"
            @click="setSelectMode('year')" />
        </div>

        <NBtn
          flat
          color="dark-s"
          icon="arrow_right"
          @click="setNext()" />
      </div>
      
      <div class="n-calendar__body">
        <div class="n-calendar-table__title row no-wrap">
          <span v-for="v in weekdaysArr" :key="v"
            class="text-color-s">{{ v }}</span>
        </div>
        <div class="row">
          <div v-for="(chunk, i) in chunkedDaysArr" :key="`chunk_${i}`"
            class="col-12 row no-wrap">
            <div v-for="v in chunk" :key="v.label"
              class="n-calendar-table__btn"
              :class="{
                'is-another-month': v.value.month != currentDate.month,
                'is-now': v.value.equals(nowDate),
                'is-selected': innerDate && v.value.equals(innerDate),
                'is-disabled': v.disabled,
              }"
              @click="!v.disabled ? setDate(v.value) : void 0">{{ v.label }}</div>
          </div>
          
        </div>
      </div>
    </template>

    <template v-if="currentMode == 'month'">
      <div class="row no-wrap flex-center">

        <div class="row">
          <div v-for="(chunk, i) in chunkedMonthsArr" :key="`chunk_${i}`"
            class="col-12 row no-wrap">
            <div v-for="v in chunk" :key="v.value"
              class="n-calendar-table__btn"
              :class="{
                'is-now': v.value == currentMonth,
              }"
              @click="onSelectMonth(v.value)">{{ v.label | startCase }}</div>
          </div>
        </div>

      </div>
    </template>

    <template v-if="currentMode == 'year'">
      <div class="row no-wrap items-center justify-between">

        <NBtn
          flat
          color="dark-s"
          icon="arrow_left"
          @click="setPrev(currentMode)" />

        <div class="row px-sm">
          <div v-for="(chunk, i) in chunkedYearArr" :key="`chunk_${i}`"
            class="col-12 row no-wrap">
            <div v-for="v in chunk" :key="v"
              class="n-calendar-table__btn"
              :class="{
                'is-now': v == currentYear,
              }"
              @click="onSelectYear(v)">{{ v }}</div>
          </div>
        </div>

        <NBtn
          flat
          color="dark-s"
          icon="arrow_right"
          @click="setNext(currentMode)" />

      </div>
    </template>
  </div>

</template>

<script>

import { DateTime, Info } from 'luxon'
import { startCase, chunk } from 'lodash'

import debug from 'debug'
const logger = debug('components:NCalendar')

const _defs = {
  dayCols: 7,
  dayRows: 6,
  monthCols: 3,
  yearCols: 3,
  yearRows: 5,

  format: 'dd.LL.yyyy'
}

export default {
  name: 'NCalendar',
  props: {
    value: String,
    // now: Boolean,
    from: String,
    fromNow: Boolean,
  },
  data () {
    return {
      nowDate: DateTime.local().startOf('day'),
      currentDate: DateTime.local().startOf('day'),

      innerValue: null,
      innerDate: null,

      fromDate: null,

      currentMode: 'day',

      weekdaysArr: Info.weekdays('short', { locale: 'ru' }),
      monthsArr: Info.months('long', { locale: 'ru' }),

      yearOffset: 0
    }
  },
  watch: {
    value (val) {
      let dt = DateTime.fromFormat(val, _defs.format)

      if (dt.isValid && (this.fromNow ? dt.diff(this.nowDate).milliseconds > 0 : true)) {
        this.innerValue = val
        this.innerDate = dt
      }
      else logger('[watch] prop "value" is invalid: %s', val)
    },
    innerDate (val) {
      this.setCurrentMonth(val.month)
      this.setCurrentYear(val.year)
    },
    from (val) {
      let dt = DateTime.fromFormat(val, _defs.format)
      if (dt.isValid) this.fromDate = dt
      else logger('[watch] prop "from" is invalid: %s', val)
    }
  },
  computed: {
    currentMonth () {
      return this.currentDate.month
    },
    currentMonthString () {
      return startCase(this.monthsArr[this.currentMonth - 1])
    },
    currentYear () {
      return this.currentDate.year
    },

    prevMonthDate () {
      return this.currentDate.startOf('month').minus({ months: 1 })
    },
    nextMonthDate () {
      return this.currentDate.startOf('month').plus({ months: 1 })
    },

    daysInPrevMonth () {
      return this.prevMonthDate.daysInMonth
    },
    daysInNextMonth () {
      return this.nextMonthDate.daysInMonth
    },
    daysInCurrentMonth () {
      return this.currentDate.daysInMonth
    },

    // номер дня в неделе первого дня текущего месяца
    weekdayOfFirstDayInCurrentMonth () {
      return this.currentDate.startOf('month').weekday
    },
    
    prevMonthRestDays () {
      let arr = [],
          dt = null,
          nowDisabled = false,
          fromDisabled = false

      for (let i = this.daysInPrevMonth; i > this.daysInPrevMonth - this.weekdayOfFirstDayInCurrentMonth + 1; i--) {
        dt = this.prevMonthDate.set({ day: i })

        if (this.fromNow) nowDisabled = dt.diff(this.nowDate).milliseconds < 0
        if (this.from) fromDisabled = dt.diff(this.fromDate).milliseconds < 0

        arr.push({
          disabled: nowDisabled || fromDisabled,
          value: dt,
          label: i
        })
      }
      return arr.reverse()
    },
    currentMonthDays () {
      let arr = [],
          dt = null,
          nowDisabled = false,
          fromDisabled = false

      for (let i = 1; i <= this.daysInCurrentMonth; i++) {
        dt = this.currentDate.set({ day: i })

        if (this.fromNow) nowDisabled = dt.diff(this.nowDate).milliseconds < 0
        if (this.from) fromDisabled = dt.diff(this.fromDate).milliseconds < 0

        arr.push({
          disabled: nowDisabled || fromDisabled,
          value: dt,
          label: i
        })
      }
      return arr
    },
    nextMonthRestDays () {
      let arr = [],
          dt = null,
          nowDisabled = false,
          fromDisabled = false

      for (let i = 1; i <= (_defs.dayCols * _defs.dayRows) - this.prevMonthRestDays.length - this.currentMonthDays.length; i++) {
        dt = this.nextMonthDate.set({ day: i })

        if (this.fromNow) nowDisabled = dt.diff(this.nowDate).milliseconds < 0
        if (this.from) fromDisabled = dt.diff(this.fromDate).milliseconds < 0

        arr.push({
          disabled: nowDisabled || fromDisabled,
          value: dt,
          label: i
        })
      }
      return arr
    },

    yearsArr () {
      let arr = [],
          yearsCount = _defs.yearCols * _defs.yearRows,
          startVal = this.currentYear - Math.floor(yearsCount / 2) + this.yearOffset * yearsCount

      for (let i = 0; i < yearsCount; i++) {
        arr.push(startVal + i)
      }

      return arr
    },
    
    computedDaysArr () {
      return this.prevMonthRestDays.concat(this.currentMonthDays, this.nextMonthRestDays)
    },
    computedMonthsArr () {
      let arr = []
      for (let i = 1; i <= 12; i++) {
        arr.push({
          value: i,
          label: this.monthsArr[i - 1]
        })
      }
      return arr
    },
    computedYearsArr () {
      return []
    },

    chunkedDaysArr () {
      return chunk(this.computedDaysArr, _defs.dayCols)
    },
    chunkedMonthsArr () {
      return chunk(this.computedMonthsArr, _defs.monthCols)
    },
    chunkedYearArr () {
      return chunk(this.yearsArr, _defs.yearCols)
    },
  },
  methods: {
    onSelectMonth (val) {
      this.setCurrentMonth(val)
      this.setSelectMode('day')
    },
    onSelectYear (val) {
      this.setCurrentYear(val)
      this.setSelectMode('day')
      this.yearOffset = 0
    },
    setSelectMode (mode) {
      this.currentMode = mode
    },
    setDate (dt) {
      this.innerDate = dt
      this.innerValue = this.innerDate.toFormat(_defs.format)
      this.emits()
    },
    setCurrentMonth (val) {
      this.currentDate = this.currentDate.set({ month: val })
    },
    setCurrentYear (val) {
      this.currentDate = this.currentDate.set({ year: val })
    },
    setPrev () {
      if (this.currentMode == 'day') this.currentDate = this.currentDate.minus({ months: 1 })
      if (this.currentMode == 'year') this.yearOffset--
    },
    setNext () {
      if (this.currentMode == 'day') this.currentDate = this.currentDate.plus({ months: 1 })
      if (this.currentMode == 'year') this.yearOffset++
    },
    emits () {
      this.$emit('input', this.innerValue)
    }
  },
  created () {
    /* if (this.now) {
      this.innerDate = this.nowDate
      this.innerValue = this.nowDate.toFormat(_defs.format)
      this.emits()
    } */

    if (this.value) {
      let dt = DateTime.fromFormat(this.value, _defs.format)

      if (dt.isValid /* && (this.fromNow ? dt.diff(this.nowDate).milliseconds > 0 : true) */) {
        this.innerValue = this.value
        this.currentDate = this.innerDate = dt
      }
      else logger('[created hook] prop "value" is invalid: %s', this.value)
    }

    if (this.from) {
      let dt = DateTime.fromFormat(this.from, _defs.format)
      if (dt.isValid) this.currentDate = this.fromDate = dt
      else logger('[created hook] prop "from" is invalid: %s', this.from)
    }
  },
  filters: {
    startCase
  }
}

</script>
