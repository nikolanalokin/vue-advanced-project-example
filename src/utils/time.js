import { DateTime, Duration } from 'luxon'
import i18n from '../localization'

import debug from 'debug'
const logger = debug('utils:time')

/**
 * Возвращает время в формате "... 5 дней назад" до недели,
 * либо в формате даты "25 ноября 2017 года в 15:30"
 * 
 * @param {Number} stamp время в секундах
 * @param {Number} now_stamp текущее время в секундах (от которого нужно отталкиваться)
 */
export function getStringTimeAgo (stamp, now_stamp) {
  let from = DateTime.fromSeconds(stamp)
    , now = now_stamp ? DateTime.fromSeconds(now_stamp) : DateTime.local()
    , string = ''
    , diffFromNow = now.diff(from)
    , diffFromStartDay = DateTime.local().startOf('day').diff(from)
    , n
    , f

  if (diffFromStartDay.milliseconds < 0) {
    if (diffFromNow.as('seconds') < 10) {
      string = 'сейчас'
    }
    else if (diffFromNow.as('seconds') < 60) {
      n = Math.floor(diffFromNow.as('seconds'))
      string = i18n.tc('seconds_genitive', n) + ' назад'
    }
    else if (diffFromNow.as('minutes') < 60) {
      n = Math.floor(diffFromNow.as('minutes'))
      string = i18n.tc('minutes_genitive', n) + ' назад'
    }
    else if (diffFromNow.as('hours') < 4) {
      n = Math.floor(diffFromNow.as('hours'))
      string = i18n.tc('hours', n) + ' назад'
    }
    else {
      string = from.toFormat("'сегодня в' H:mm")
    }
  } else {
    n = diffFromStartDay.as('days')
    f = Math.floor(n) + 1

    if (n < 1) {
      string = from.toFormat("'вчера в' H:mm")
    }
    else if (n < 7) {
      string = i18n.tc('days', f) + ' назад ' + from.toFormat("'в' H:mm")
    }
    else {
      string = from.toFormat("DDD 'в' H:mm")
    }
  }

  return string
}

/**
 * Возвращает время в короткой форме: сейчас, ЧЧ:ММ, день недели, дата (без и с годом)
 * 
 * @param {Number} stamp время в секундах
 * @param {Number} now_stamp текущее время в секундах (от которого нужно отталкиваться)
 */
export function getShortStringTimeAgo (stamp, now_stamp) {
  let from = DateTime.fromSeconds(stamp)
    , now = (now_stamp ? DateTime.fromSeconds(now_stamp) : DateTime.local())
    , string = ''
    , diffFromNow = now.diff(from)
    , diffFromStartDay = DateTime.local().startOf('day').diff(from)
    , n

  if (diffFromStartDay.milliseconds < 0) {
    if (diffFromNow.as('seconds') < 15) {
      string = 'сейчас'
    }
    else {
      string = from.toFormat("H:mm")
    }
  } else {
    n = diffFromStartDay.as('days')

    if (n < 7) {
      string = from.weekdayShort
    }
    else if (from.year == now.year) {
      string = from.toFormat("d.LL")
    }
    else {
      string = from.toFormat("d.LL.yy")
    }
  }

  return string
}