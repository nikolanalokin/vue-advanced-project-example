import unicodeRe from 'emoji-regex'
import Quill from 'quill'

import { Emoji } from './emoji.model'
import emojis from './emoji.data-map'

const Module = Quill.import('core/module')

export const emojiModuleOptions = {
  emojiData: emojis,
  showTitle: true,
  preventDrag: true,
  indicator: ':',
  convertEmoticons: false,
  convertShortNames: false,
  set: 'apple',
  backgroundImageFn: (set, sheetSize) => {
    return `https://liveonce.ru/img/emoji/${set}/sheets/sheet_apple_${sheetSize}_indexed_256.png`
  }
}

export class EmojiModule extends Module {
  // tslint:disable-next-line: no-shadowed-variable
  constructor (quill, options) {
    super(quill, options)
    this.quill = quill
    this.isEdgeBrowser = false
    this.pasted = false
    if (navigator.userAgent.indexOf('Edge') > -1) {
      this.isEdgeBrowser = true
    }
    if (this.options.preventDrag) {
      // Prevent emojis from dragging
      quill.container.addEventListener('dragstart', (event) => {
        event.preventDefault()
        return false
      })
    }
    // Convert pasted unicode / emoticons / shortNames
    this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
      return Emoji.convertPaste(delta, this.replacements)
    })
    // Listen for text change to convert typed in emojis or pasted emojis using Windows 10 Emojis / mobile
    quill.on('text-change', (delta, oldDelta, source) => {
      // text-change also triggers on a paste event, this is a hack to prevent one more check
      if (!this.pasted && source === Quill.sources.USER) {
        const changes = Emoji.convertInput(quill.getContents(), this.replacements)
        if (changes.ops.length > 0) {
          quill.updateContents(changes, Quill.sources.SILENT)
        }
      }
      this.pasted = false
    })
    // Changing cut to copy and delete
    // There seems to be a bug with Quill + Chrome with cut. The performance is much worse
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      quill.container.addEventListener('cut', (event) => {
        const selection = document.getSelection()
        document.execCommand('copy')
        selection.deleteFromDocument()
        event.preventDefault()
      })
    }
    // Edge Bug #1: Image alt tags are not copied.
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/13921866/
    // Edge Bug #2: the url() functions in inline styles are getting escaped when pasted
    quill.container.addEventListener('paste', (event) => {
      this.pasted = true
      if (this.isEdgeBrowser) {
        event.clipboardData.setData('text/html', event.clipboardData.getData('text/html').replace(/&amp;quot;/g, '"'))
      }
    })
  }
  get replacements () {
    const replacements = [
      // Unicode to Emoji
      {
        regex: new RegExp(Emoji.unicodeRe, 'i'),
        matchIndex: 0,
        replacementIndex: 0,
        fn: (str) => Emoji.unicodeToEmoji(str)
      }
    ]
    if (this.options.convertEmoticons) {
      // Emoticons to Emoji
      replacements.push({
        regex: new RegExp(Emoji.emoticonRe, 'i'),
        matchIndex: 1,
        replacementIndex: 1,
        fn: (str) => Emoji.emoticonToEmoji(str)
      })
    }
    if (this.options.convertShortNames) {
      // ShortNames to Emoji
      replacements.push({
        regex: new RegExp(Emoji.shortNameRe, 'i'),
        matchIndex: 2,
        replacementIndex: 1,
        fn: (str) => Emoji.shortNameToEmoji(str)
      })
    }
    return replacements
  }
  get options () {
    return EmojiModule.options
  }
  set options (options) {
    EmojiModule.options = { ...emojiModuleOptions, ...options }
  }
}

EmojiModule.options = emojiModuleOptions
