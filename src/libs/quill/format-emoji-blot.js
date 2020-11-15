import Quill from 'quill'
import emojiMap from './emoji-map'

const Embed = Quill.import('blots/embed')

class EmojiBlot extends Embed {
  static create(value) {
    let node = super.create()
    if (typeof value === 'object') {

      EmojiBlot.buildSpan(value, node)
    } else if (typeof value === 'string') {
      const valueObj = emojiMap[value]

      if (valueObj) {
        EmojiBlot.buildSpan(valueObj, node)
      }
    }

    return node
  }

  static value(node) {
    return node.dataset.name
  }

  static buildSpan(value, node) {
    node.setAttribute('data-name', value.name)
    let unicodeString = String.fromCodePoint(...EmojiBlot.parseUnicode(value.unified))
    let el = document.createElement('img')
    el.classList.add(this.emojiClass)
    el.dataset.shortname = value.short_name
    el.dataset.codepoints = value.unified
    el.alt = unicodeString
    el.src = 'https://liveonce.ru/img/emoji/apple/64/' + value.image
    node.appendChild(el)
  }
  static parseUnicode(string) {
    return string.split('-').map(str => parseInt(str, 16))
  }
}

EmojiBlot.blotName = 'emoji'
EmojiBlot.className = 'ql-emojiblot'
EmojiBlot.tagName = 'span'
EmojiBlot.emojiClass = 'emoji'
EmojiBlot.emojiPrefix = 'ap-'

export default EmojiBlot