import { isNaN } from 'lodash'
import API from '../services/api'

import $router from '../router'

import { getStringTimeAgo } from './time'
import uuid from './uuid'

/**
 * Проверяет, является ли функция вызываемой.
 * @param {any} func
 * @return {boolean}
 */
export const isCallable = (func) => typeof func === 'function'

/**
 * Assign polyfill from the mdn.
 * @param {Object} target
 * @param {any[]} others
 * @return {Object}
 */
export const assign = (target, ...others) => {

  if (isCallable(Object.assign)) {
    return Object.assign(target, ...others)
  }

  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  const to = Object(target)

  others.forEach(arg => {

    if (arg != null) {
      Object.keys(arg).forEach(key => {
        to[key] = arg[key]
      })
    }
  })

  return to
}

/**
 * Возвращает 
 * @param {*} values 
 */
export const getValuesAsString = (values) => {
  return Array.isArray(values) ? values.join(',') : values
}

export const getFormDataObj = (data) => {

  let fd = new FormData()

  if (data != null) {
    Object.keys(data).forEach(key => {
      if (data[key] != undefined) {
        if (typeof data[key] == 'object' && !(data[key] instanceof File)) fd.set(key, JSON.stringify(data[key]))
        else fd.set(key, data[key])
      }
    })
  }

  return fd
}

export const getPageCoords = (el) => {
  let box = el.getBoundingClientRect()

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
    bottom: box.bottom + pageYOffset,
    right: box.right + pageXOffset,
    width: box.right - box.left,
    height: box.bottom - box.top
  }
}

export const getClientCoords = (el) => {
  var box = el.getBoundingClientRect()

  return {
    top: box.top,
    left: box.left,
    bottom: box.bottom,
    right: box.right,
    width: box.right - box.left,
    height: box.bottom - box.top
  }
}

export const getUIID = () => {
  return Math.random().toString(36).slice(4)
}

export function downloadFile(sUrl) {

  let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  let isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1

  //iOS devices do not support downloading. We have to inform user about this.
  if (/(iP)/g.test(navigator.userAgent)) {
    //alert('Your device does not support files downloading. Please try again in desktop browser.')
    window.open(sUrl, '_blank')
    return false
  }

  //If in Chrome or Safari - download via virtual link click
  if (isChrome || isSafari) {
    //Creating new link node.
    var link = document.createElement('a')
    link.href = sUrl
    link.setAttribute('target', '_blank')

    if (link.download !== undefined) {
      //Set HTML5 download attribute. This will prevent file from opening if supported.
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length)
      link.download = fileName
    }

    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }

  // Force file download (whether supported by server).
  if (sUrl.indexOf('?') === -1) {
    sUrl += '?download'
  }

  window.open(sUrl, '_blank')
  return true
}

export function openLink (url) {
  var link = document.createElement('a')
  link.href = url
  link.setAttribute('target', '_blank')

  if (document.createEvent) {
    var e = document.createEvent('MouseEvents')
    e.initEvent('click', true, true)
    link.dispatchEvent(e)
    return true
  }
}

export const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

export const weekdays = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресение'
]

export const marital = {
  1: {
    1: 'Не женат',
    2: 'Есть подруга',
    3: 'Помолвлен',
    4: 'Женат',
    5: 'Всё сложно',
    6: 'В активном поиске',
    7: 'Влюблён',
    8: 'В гражданском браке'
  },
  2: {
    1: 'Не замужем',
    2: 'Есть друг',
    3: 'Помолвлена',
    4: 'Замужем',
    5: 'Всё сложно',
    6: 'В активном поиске',
    7: 'Влюблёна',
    8: 'В гражданском браке'
  }
}

export function getOptionsWithNumbers(startNum, finishNum) {
  let arr = new Array(Math.abs(finishNum - startNum) + 1)
    , val = startNum
    , options = []

  for (let item of arr) {
    item = val
    options.push({
      value: item,
      label: item
    })
    if (startNum < finishNum) val++
    else val--
  }

  return options
}

Array.prototype.move = function (old_index, new_index) {
  while (old_index < 0) {
    old_index += this.length
  }
  while (new_index < 0) {
    new_index += this.length
  }
  if (new_index >= this.length) {
    var k = new_index - this.length
    while ((k--) + 1) {
      this.push(undefined)
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0])
  return this // for testing purposes
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

Date.prototype.isToday = function () {
  const today = new Date()
  return this.getDate() === today.getDate() &&
  this.getMonth() === today.getMonth() &&
  this.getFullYear() === today.getFullYear()
}

export const now = global.performance && global.performance.now
  ? function now() {
    return performance.now()
  }
  : Date.now || function now() {
    return +new Date
  }

export function getMaxSizeImageUrlFromObj(obj) {
  let size = 0

  Object.keys(obj).forEach(item => {
    item = +item
    if (item > size) size = item
  })

  return obj[size]
}

export function getImgAspectRatio(url) {
  return new Promise((resolve, reject) => {
    let img_clone = new Image()
    img_clone.src = url

    img_clone.onload = () => {
      resolve(img_clone.width / img_clone.height)
    }
    img_clone.onerror = () => {
      reject('[utils] getImgAspectRatio -> Img not loaded! Can not define ratio of image.')
    }
  });
}

export const decodeEntities = (function () {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div')

  function decodeHTMLEntities(str) {
    if (str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
      element.innerHTML = str
      str = element.textContent
      element.textContent = ''
    }

    return str
  }

  return decodeHTMLEntities
})()

export function clearContenteditableTextField(fieldEl) {

  if (fieldEl) {

    //console.log("+", fieldEl);
    var childEl = fieldEl.firstChild;
    //console.log("+", childEl);
    var result = '', contTag = new RegExp('^(DIV|P|LI|OL|TR|TD|BLOCKQUOTE)$');
    while (childEl) {
      //console.log("+", childEl);
      //console.log("nodeType", childEl.nodeType);
      switch (childEl.nodeType) {
        case 3: //TEXT_NODE
          var str = childEl.data.replace(/^(&nbsp;|&ensp;|&emsp;)+|(&nbsp;|&ensp;|&emsp;)+$/gm, '')/* .replace(/^\n|\n$/g, ' ').replace(/[\n\xa0]/g, ' ').replace(/[ ]+/g, ' '); */
          result += str;
          break;
        case 1: //ELEMENT_NODE
          var str = clearContenteditableTextField(childEl);
          if (childEl.tagName && childEl.tagName.match(contTag) && str) {
            if (str.substr(-1) != '\n') str += '\n';
            var prev = childEl.previousSibling;
            while (prev && prev.nodeType == 3 && prev.nodeValue.trim() == '') prev = prev.previousSibling;
            if (prev && !(prev.tagName && prev.tagName.match(contTag))) str = '\n' + str;
          } else if (childEl.tagName == 'IMG') {
            str += ':' + childEl.dataset.name + ':';
          } else if (childEl.tagName == 'BR') str += '\n';
          result += str;
          break;
      }
      childEl = childEl.nextSibling;
    }
    return result;
  }
  return '';
}

export function truncate (str, maxlength) {
  return (str.length > maxlength) ? str.slice(0, maxlength - 1) + '…' : str;
}

export async function getIdByOwnerIdOrScreenName({ oid, fields }) {

  let id = oid, type, data

  try {
    if (isNaN(+id)) {
      let response = await API.utils.resolveScreenName({
        screen_name: id,
        fields
      })
  
      id = response && response.object_id || null
      type = response && response.type || null
      data = response && response.object || null
    }
  
    return {
      id: Math.abs(+id),
      type,
      data
    }
  } catch (err) {
    throw err
  }
}

export async function setWindowTitle(title, postfix = true) {
  window.document.title = `${title}${postfix ? ' | LO' : ''}`
}

export function formatToAttachments({ photo = [], video = [], audio = [] }) {
  let result = []

  if (photo.length) {
    for (let item of photo) {
      result.push(`photo${item.owner_id}_${item.id}`)
    }
  }
  if (video.length) {
    for (let item of video) {
      result.push(`video${item.owner_id}_${item.id}`)
    }
  }
  if (audio.length) {
    for (let item of audio) {
      result.push(`audio${item.owner_id}_${item.id}`)
    }
  }

  return result
}

export function getLinkByData(data, type) {
  if (!data) {
    console.warn('[getLinkByData] >> Отсутствует data.')
    return 
  }

  if (typeof data !== 'object' && type != null) {
    data = {
      id: data
    }
  }

  if (data.hasOwnProperty('first_name')) type = -1

  if (type == null) {
    if (+data.type == undefined) {
      console.warn('[getLinkByData] >> Отсутствует type объекта.')
      return ''
    } else {
      type = +data.type
    }
  }

  if (data.hasOwnProperty('screen_name') && data.screen_name) {
    return {
      name: 'distributive',
      params: {
        screen_name: data.screen_name
      }
    }
  }
  if (type == -1 || type == 'user') {
    return {
      name: 'userProfile',
      params: {
        uid: data.id
      }
    }
  }
  if (type == 0 || type == 'community') {
    return {
      name: 'communityProfile',
      params: {
        oid: data.id
      }
    }
  }
  if (type == 1 || type == 'place') {
    return {
      name: 'placeProfile',
      params: {
        oid: data.id
      }
    }
  }
  if (type == 2 || type == 'event') {
    return {
      name: 'eventProfile',
      params: {
        oid: data.id
      }
    }
  }
}

export async function initCountryCity({ country_id, city_id }, asOptions = false) {
  try {
    let response1, response2

    if (country_id) {
      response1 = await API.database.getCountriesById({
        country_ids: country_id
      })
    }
    if (city_id) {
      response2 = await API.database.getCitiesById({
        city_ids: city_id
      })
    }
    if (asOptions) {
      return [{
        country: response1[0],
        city: response2[0]
      }]
    } else {
      return {
        country: response1[0],
        city: response2[0]
      }
    }
  } catch (error) {
    console.warn(error)
  }
}

export function getHeaderDataFromMembersList({ membersList, oid, avatarSize = 100 }) {
  let item = membersList[+oid > 0 ? 'users' : 'unions'].find(item => +item.id == Math.abs(+oid))

  return item ? {
    ...item,
    name: +oid > 0 ? `${item.first_name} ${item.last_name}` : item.name,
    link: +oid > 0 ? getLinkByData(item, -1) : void 0,
    sex: +oid > 0 ? +item.sex : void 0,
    avatarUrl: item.photo && item.photo[avatarSize],
    avatarUrls: item.photo
  } : {}
}

export function getOnlineString(data) {
  if (!data || data.online === void 0) return { str: '', is: null }

  let online = !!+data.online
  return {
    str: online ? 'онлайн' : (+data.sex == 1 ? 'был' : 'была') + ' онлайн ' + getStringTimeAgo(+data.last_visit),
    is: online
  }
}

export var setZeroTimeout = (function () {
  var fn, ctx

  window.addEventListener('message', function () {
    if (fn) {
      fn.call(ctx)
    }
  }, false)

  return function (_fn, _ctx) {
    fn = _fn
    ctx = _ctx
    window.postMessage('', '*')
  }
})()

export function getPageHTMLFromUrl(url) {
  return new Promise((resolve, reject) => {
    /* let iframeEl = document.getElementById('utils_iframe')
      
    iframeEl.src = url
    console.dir(iframeEl);

    iframeEl.onload = (e) => {
      console.dir(e);

      let iframeDoc = iframeEl.contentWindow.document
      resolve(iframeDoc.documentElement.innerHTML)
    } */

    let iframeEl = document.createElement('iframe')

    let id = uuid.short()

    iframeEl.src = url
    iframeEl.id = id
    document.documentElement.appendChild(iframeEl)

    iframeEl.onload = (e) => {
      let el = document.getElementById(id)
      console.dir(el);
      let iframeDoc = el.contentDocument

      iframeEl.remove()
      iframeEl = null

      resolve(iframeDoc.documentElement.innerHTML)
    }
  })
}
/**
 * @param {Function} fn - функция обратного вызова обязательно должна быть не анонимной (иметь название)
 */
export const getMetaDataFromAudioStream = (function () {
  var script

  return function shout({ fn, src, sid }) {
    if (window[fn.name] === undefined) window[fn.name] = fn
    if (script) document.body.removeChild(script)
    script = document.createElement('script')
    script.src = `${src}/stats?json=1&callback=${fn.name}${sid ? '&sid=' : ''}&rand=${Math.random()}`
    document.body.appendChild(script)
  }
}())

export function tsNow (inSeconds = true) {
  if (inSeconds) return Math.floor(+new Date() / 1000)
  else return +new Date()
}

export async function loadSubjectData (id) {
  try {
    let response
    let _data, _id = +id
    if (_id > 0) {
      response = await API.users.get({
        user_ids: _id, 
        fields: 'photo'
      })
      _data = response.items[0]
    } else {
      _id = Math.abs(_id)
      response = await API.unions.communitiesGetById({
        community_ids: _id,
        fields: 'photo,type'
      })
      if (!response) {
        response = await API.unions.placesGetById({
          place_ids: _id,
          fields: 'photo,type'
        })
        if (!response) {
          response = await API.unions.eventsGetById({
            event_ids: _id,
            fields: 'photo,type'
          })
        }
      }
      _data = response[0]
    }
    return _data
  } catch (err) {
    throw err
  }
}

export function getLink (routerParam) {
  return 'https://liveonce.ru' + $router.resolve(routerParam).href  // window.location.hostname
}

export function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

    // поменять элементы местами
    // мы используем для этого синтаксис "деструктурирующее присваивание"
    // подробнее о нём - в следующих главах
    // то же самое можно записать как:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function parseUnicode (string) {
  return string.split('-').map(str => parseInt(str, 16))
}

export function getEmojiUnicode (string) {
  return String.fromCodePoint(...parseUnicode(string))
}