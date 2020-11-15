import UrlParse from 'url-parse'
import unicodeRe from 'emoji-regex'

import { truncate } from '../../../utils'
import { Emoji } from '../../../libs/quill/emoji'
import { TLD } from '../../../data/constants'

// const emojiRegExp = '\\u0023\\u20E3|\\u00a9|\\u00ae|\\u203c|\\u2049|\\u2139|[\\u2194-\\u2199]|\\u21a9|\\u21aa|\\u231a|\\u231b|\\u23e9|[\\u23ea-\\u23ec]|\\u23f0|\\u24c2|\\u25aa|\\u25ab|\\u25b6|\\u2611|\\u2614|\\u26fd|\\u2705|\\u2709|[\\u2795-\\u2797]|\\u27a1|\\u27b0|\\u27bf|\\u2934|\\u2935|[\\u2b05-\\u2b07]|\\u2b1b|\\u2b1c|\\u2b50|\\u2b55|\\u3030|\\u303d|\\u3297|\\u3299|[\\uE000-\\uF8FF\\u270A-\\u2764\\u2122\\u25C0\\u25FB-\\u25FE\\u2615\\u263a\\u2648-\\u2653\\u2660-\\u2668\\u267B\\u267F\\u2693\\u261d\\u26A0-\\u26FA\\u2708\\u2702\\u2601\\u260E]|[\\u2600\\u26C4\\u26BE\\u23F3\\u2764]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83C[\\uDDE8-\\uDDFA\uDDEC]\\uD83C[\\uDDEA-\\uDDFA\uDDE7]|[0-9]\\u20e3|\\uD83C[\\uDC00-\\uDFFF]'

const alphaCharsRegExp = 'a-z' +
  '\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff' + // Latin-1
  '\\u0100-\\u024f' + // Latin Extended A and B
  '\\u0253\\u0254\\u0256\\u0257\\u0259\\u025b\\u0263\\u0268\\u026f\\u0272\\u0289\\u028b' + // IPA Extensions
  '\\u02bb' + // Hawaiian
  '\\u0300-\\u036f' + // Combining diacritics
  '\\u1e00-\\u1eff' + // Latin Extended Additional (mostly for Vietnamese)
  '\\u0400-\\u04ff\\u0500-\\u0527' + // Cyrillic
  '\\u2de0-\\u2dff\\ua640-\\ua69f' + // Cyrillic Extended A/B
  '\\u0591-\\u05bf\\u05c1-\\u05c2\\u05c4-\\u05c5\\u05c7' +
  '\\u05d0-\\u05ea\\u05f0-\\u05f4' + // Hebrew
  '\\ufb1d-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40-\\ufb41' +
  '\\ufb43-\\ufb44\\ufb46-\\ufb4f' + // Hebrew Pres. Forms
  '\\u0610-\\u061a\\u0620-\\u065f\\u066e-\\u06d3\\u06d5-\\u06dc' +
  '\\u06de-\\u06e8\\u06ea-\\u06ef\\u06fa-\\u06fc\\u06ff' + // Arabic
  '\\u0750-\\u077f\\u08a0\\u08a2-\\u08ac\\u08e4-\\u08fe' + // Arabic Supplement and Extended A
  '\\ufb50-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb' + // Pres. Forms A
  '\\ufe70-\\ufe74\\ufe76-\\ufefc' + // Pres. Forms B
  '\\u200c' + // Zero-Width Non-Joiner
  '\\u0e01-\\u0e3a\\u0e40-\\u0e4e' + // Thai
  '\\u1100-\\u11ff\\u3130-\\u3185\\uA960-\\uA97F\\uAC00-\\uD7AF\\uD7B0-\\uD7FF' + // Hangul (Korean)
  '\\u3003\\u3005\\u303b' + // Kanji/Han iteration marks
  '\\uff21-\\uff3a\\uff41-\\uff5a' + // full width Alphabet
  '\\uff66-\\uff9f' + // half width Katakana
  '\\uffa1-\\uffdc'; // half width Hangul (Korean)

const alphaNumericRegExp = '0-9\_' + alphaCharsRegExp

const domainAddChars = '\u00b7'

// Based on Regular Expression for URL validation by Diego Perini
const urlRegExp = '((?:https?|ftp)://|mailto:)?' +
  // user:pass authentication
  '(?:\\S{1,64}(?::\\S{0,64})?@)?' +
  '(?:' +
  // sindresorhus/ip-regexp
  '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}' +
  '|' +
  // host name
  '[' + alphaCharsRegExp + '0-9][' + alphaCharsRegExp + domainAddChars + '0-9\-]{0,64}' +
  // domain name
  '(?:\\.[' + alphaCharsRegExp + '0-9][' + alphaCharsRegExp + domainAddChars + '0-9\-]{0,64}){0,10}' +

  // TLD identifier
  '(?:\\.(xn--[0-9a-z]{2,16}|[' + alphaCharsRegExp + ']{2,24}))' +
  ')' +
  // port number
  '(?::\\d{2,5})?' +
  // resource path
  '(?:/(?:\\S{0,255}[^\\s.;,(\\[\\]{}<>"\'])?)?'

const allowedHosts = [
  'liveonce.ru',
  'm.liveonce.ru',
  'beta.liveonce.ru',
  'ios.liveonce.ru',
  'android.liveonce.ru'
]

export default {
  name: 'NTextWrap',
  props: {
    data: {
      type: String,
      default: ''
    },
    inline: Boolean,
    contents: Boolean,
    emojiOnly: Boolean,
    clippable: Boolean,
    clipLength: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      clipped: true
    }
  },
  computed: {
    classes () {
      return {
        'is-inline': this.inline,
        'is-contents': this.contents,
      }
    }
  },
  methods: {
    __getEmoji (h, data) {
      // console.log('__getEmoji', data)
      return h('img', {
        class: 'emoji',
        style: {
          fontSize: 'inherit',
        },
        attrs: {
          src: Emoji.getImageSrc(data),
          alt: Emoji.unifiedToNative(data.unified)
        }
      })
    },
    __getExternalLink (h, data) {
      // console.log('__getExternalLink', data)
      return h('NLink', {
        class: 'link__external',
        props: {
          url: data
        }
      }, truncate(data, 50))
    },
    __getInteriorLink (h, data) {
      // console.log('__getInteriorLink', data)
      return h('router-link', {
        class: 'link link__interior',
        props: {
          to: {
            path: data.pathname + data.query
          }
        }
      }, data.host + data.pathname + data.query)
    },
    __getHashtagLink (h, data) {
      // console.log('__getHashtagLink', data)
      return h('router-link', {
        class: 'link link__hashtag',
        props: {
          to: {
            name: 'news',
            query: {
              hashtag: data
            }
          }
        }
      }, '#' + data)
    },
    __render (h) {
      let fullRegExp

      if (this.emojiOnly) {
        fullRegExp = new RegExp(`(${unicodeRe()})`, 'i')
      } else {
        fullRegExp = new RegExp(`(${unicodeRe()})|(${urlRegExp})|(#[${alphaNumericRegExp}@]{2,64})`, 'i')
      }

      let text = this.data

      let nodes = []
      let match = null
      let raw = text
      let offset = 0

      // console.log('start render')
      // console.log('text:', text)

      while (match = raw.match(fullRegExp)) {
        // console.log('match:', match)
        if (match.index > 0) {
          let str = raw.substring(0, match.index)
          nodes.push({
            text: str,
            node: str
          })
        }

        if (match[1]) { // emoji
          let emoji = Emoji.unicodeToEmoji(match[0])
          let str = match[0]
          nodes.push({
            text: str,
            node: this.__getEmoji(h, emoji)
          })
        } else if (match[2]) { // url
          let url
          let protocol = match[3]
          let tld = match[4]

          if (tld) { // URL
            if (!protocol && (tld.substr(0, 4) === 'xn--' || TLD.indexOf(tld.toLowerCase()) !== -1)) {
              protocol = 'https://'
            }

            if (protocol) {
              // let balanced = checkBrackets(match[4])

              // if (balanced.length !== match[4].length) {
              //   excluded = match[4].substring(balanced.length)
              //   match[4] = balanced
              // }

              url = (match[3] ? '' : protocol) + match[2]
            }
          } else { // IP address
            url = (match[3] ? '' : 'http://') + match[2]
          }
          
          let str = match[0]
          if (url) {
            let urlObj = new UrlParse(url)
            // /liveonce\.ru$/i.test(urlObj.hostname)
            if (allowedHosts.includes(urlObj.hostname)) {
              nodes.push({
                text: str,
                node: this.__getInteriorLink(h, urlObj)
              })
            } else {
              nodes.push({
                text: str,
                node: this.__getExternalLink(h, url)
              })
            }
          } else {
            nodes.push({
              text: str,
              node: str
            })
          }
        } else if (match[5]) { // hashtag
          let hashtag = match[5].replace('#', '')
          let str = match[0]
          nodes.push({
            text: str,
            node: this.__getHashtagLink(h, hashtag)
          })
        }

        raw = raw.substr(match.index + match[0].length)
        offset += match.index + match[0].length

        // console.log(raw, offset)
      }

      if (offset < text.length) {
        let str = text.substring(offset)
        nodes.push({
          text: str,
          node: str
        })
      }

      // let text = this.clippable && this.clipped ? truncate(this.data, this.clipLength) : this.data
      if (this.clippable && this.clipped) {
        let length = 0
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          // console.log('node:', node)
          length += node.text.length
          if (length > this.clipLength && typeof node.node == 'string') {
            node.node = truncate(node.node, length - this.clipLength)
            nodes = nodes.slice(0, i + 1)
            break
          }
        }
      }

      // console.log(
      //   ' nodes', nodes,
      //   '\n input length', this.data.length,
      //   '\n clip length', this.clipLength,
      //   '\n result length', (nodes.map(v => v.text) || []).join('').length
      // )
      // console.log('end render')

      return nodes.map(v => v.node)
    },
  },
 
  render (h) {
    let children = []

    children.push(this.__render(h))

    if (this.clippable && this.data.length > this.clipLength && this.clipped) {
      children.push(h('div', {
        class: 'text-primary text-body-n-bold cursor-pointer',
        on: {
          click: () => {
            this.clipped = !this.clipped
          }
        }
      }, this.clipped ? 'Читать полностью' : 'Скрыть'))
    }

    return h(this.inline ? 'span' : 'div', {
      staticClass: 'n-text-wrap',
      class: this.classes
    }, children)
  },
}