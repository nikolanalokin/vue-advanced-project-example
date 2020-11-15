import Quill from 'quill'

import { EmojiBlot } from './emoji.quill-blot'
import { EmojiModule, emojiModuleOptions } from './emoji.quill-module'
import { Emoji } from './emoji.model'
import emojis from './emoji.data-map'

// Sadly the p tags are getting copied in Firefox and creating random line breaks when pasted - so using divs instead
if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
  const Block = Quill.import('blots/block')
  Block.tagName = 'div'
  Quill.register(Block)
}

Quill.register({
  'modules/emoji-module': EmojiModule,
  'formats/emoji': EmojiBlot
}, true)

Emoji.uncompress(emojiModuleOptions.emojiData, emojiModuleOptions)

export { EmojiBlot, EmojiModule, Emoji, emojis }
