import assert from 'assert'

import { DateTime } from 'luxon'
import { getShortStringTimeAgo } from '../../src/utils/time'

let now = DateTime.fromObject({
  zone: 'local',
  year: 2019,
  month: 6,
  day: 25,

  hour: 10,
  minute: 15,
  second: 0
})

describe('time.js module', function () {

  describe('getShortStringTimeAgo', function () {

    it('10 минут назад', function () {
      assert.equal(
        getShortStringTimeAgo(
          now.minus({ minutes: 10 }).toMillis(),
          now.toMillis()
        ), 
        '10:05'
      )
    })

    it('1 день назад от начала текущего дня', function () {
      assert.equal(
        getShortStringTimeAgo(
          now.startOf('day').minus({ days: 1 }).toMillis(),
          now.toMillis()
        ), 
        'ср'
      )
    })

    it('6 дней назад от начала текущего дня', function () {
      assert.equal(
        getShortStringTimeAgo(
          now.startOf('day').minus({ days: 6 }).toMillis(),
          now.toMillis()
        ), 
        'чт'
      )
    })

    it('7 дней и 10 минут назад от начала текущего дня', function () {
      assert.equal(
        getShortStringTimeAgo(
          now.startOf('day').minus({ days: 7, minutes: 10 }).toMillis(),
          now.toMillis()
        ), 
        '17.06'
      )
    })

  })

})