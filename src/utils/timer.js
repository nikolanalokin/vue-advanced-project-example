import { Duration } from 'luxon'

export default class Timer {

  constructor ({
    duration,
    interval = 1000,
    ontick = (() => {}),
    onpause = (() => {}),
    onunpause = (() => {}),
    callback = (() => {}),
    alwaysRunCallback = false,
    runCallbackOnStart = true,
    autoStart = true,
    loop = false
  }) {

    this._totalDuration = duration
    this._interval = interval
    this._ontick = ontick
    this._onpause = onpause
    this._onunpause = onunpause
    this._callback = callback
    this._alwaysRunCallback = alwaysRunCallback
    this._runCallbackOnStart = runCallbackOnStart
    this._autoStart = autoStart
    this._loop = loop

    this.init()
  }

  init () {
    this._isStarted = false
    this._isStopped = false
    this._isFinished = false
    this._isRunning = false
    this._isPaused = false
    this._remainingDuration = this._totalDuration
    this._pastDuration = 0
    this._timer = null

    if (this._autoStart) this.start()
  }

  reset () {
    clearInterval(this._timer)
    this._timer = null
    this._isStarted = false
    this._isStopped = false
    this._isFinished = false
    this._isRunning = false
    this._isPaused = false
    this._remainingDuration = this._totalDuration
    this._pastDuration = 0
  }

  start () {
    if (this._isPaused && this._isRunning) {
      this._isPaused = false
      this._timer = setInterval(() => {
        this._tick()
      }, this._interval)
      this._onunpause(this)
      return
    }

    this._isStarted = true
    this._isRunning = true
    if (this._runCallbackOnStart) this._ontick(this, true)
    this._timer = setInterval(() => {
      this._tick()
    }, this._interval)
  }

  pause () {
    this._isPaused = true
    clearInterval(this._timer)
    this._onpause(this)
  }

  unpause () {
    this._isPaused = false
    this._timer = setInterval(() => {
      this._tick()
    }, this._interval)
    this._onunpause(this)
  }

  stop () {
    clearInterval(this._timer)
    this._isStopped = true
    this._isRunning = false
    if (this._alwaysRunCallback || this._isFinished) this._callback(this)
  }

  pastDurationToString () {
    return formatTime(this._pastDuration/1000)
  }

  remainingDurationToString () {
    return formatTime(this._remainingDuration/1000)
  }

  _tick () {
    if (this._isPaused) return

    if (!this._loop) {
      if (this._remainingDuration <= 0) {
        this._isFinished = true
        this.stop()
        return
      }
      this._remainingDuration -= this._interval
    }
    
    this._pastDuration += this._interval
    this._ontick(this)
  }

  set interval (value) {
    this._interval = value
  }
  
  set duration (value) {
    this._totalDuration = value
  }

  set ontick (func) {
    this._ontick = func
  }

  set onpause (func) {
    this._onpause = func
  }

  set onunpause (func) {
    this._onunpause = func
  }

  get isStarted () {
    return this._isStarted
  }

  get isStopped () {
    return this._isStopped
  }

  get isFinished () {
    return this._isFinished
  }

  get isRunning () {
    return this._isRunning
  }

  get isPaused () {
    return this._isPaused
  }

  set pastDuration (value) {
    if (value > this._totalDuration) return false
    this._pastDuration = value
    this._remainingDuration = this._totalDuration - this._pastDuration
  }

  get pastDuration () {
    return this._pastDuration
  }

  set remainingDuration (value) {
    if (value > this._totalDuration) return false
    this._remainingDuration = value
    this._pastDuration = this._totalDuration - this._remainingDuration
  }

  get remainingDuration () {
    return this._remainingDuration
  }
}

/**
 * Форматирует длительность во время 'h:mm:ss'
 * @param {*} duration s
 */
export function formatTime (duration) {
  let dur, string, h, m, s
    
  dur = Duration.fromMillis(duration*1000).shiftTo('hours', 'minutes', 'seconds').toObject()

  h = Math.floor(dur.hours)
  m = Math.floor(dur.minutes)
  s = Math.floor(dur.seconds)

  string = `${h?h+':':''}${m?m:'0'}:${s?s<10?'0'+s:s:'00'}`

  return string
}

/*
let timer = new Timer({
  duration: 6e5,            // Длительность выполнения
  interval: 500,            // Время между каждый тиком
  runCallbackOnStart: true, // Выполнять ontick в начале работы таймера
  alwaysRunCallback: true,  // Выполнять callback даже в случае остановки таймера
  autoStart: true,          // Запустить после инициализации
  loop: false,              // Режим цикла (аналогично setInterval)
  ontick: () => {},         // Коллбэк на каждый тик таймера
  onpause: () => {},        // Коллбэк на паузу
  onunpause: () => {},      // Коллбэк на запуск после паузы
  callback: () => {},       // Коллбэк на завершение работы таймера
})

timer.start()  // Запуск таймера и продолжение работы после паузы
timer.pause()  // Ставит таймер на паузу
timer.stop()   // Принудительно завершает выполнение таймера
timer.reset()  // Восстанавливает начальные значения

timer.remainingDuration // get {Number} Оставшееся время до завершения, миллисекунды
timer.pastDuration      // get {Number} Прошедшее время с начала работы, миллисекунды
*/