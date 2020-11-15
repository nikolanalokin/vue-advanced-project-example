import Quill from 'quill'

import { Emoji } from './emoji.model'
import { EmojiModule } from './emoji.quill-module'

const Parchment = Quill.import('parchment')

export class EmojiBlot extends Parchment.Embed {
  static create (value) {
    const node = super.create()
    const options = EmojiModule.options
    if (value) {
      Emoji.buildImage(value, node, options)
    }
    return node
  }
  static value (node) {
    return node.getAttribute('alt')
  }
}

EmojiBlot['blotName'] = 'emoji'
EmojiBlot['className'] = 'ql-emoji'
EmojiBlot['tagName'] = 'img'
