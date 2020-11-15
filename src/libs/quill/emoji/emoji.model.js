import unicodeRe from 'emoji-regex'
import Quill from 'quill'

const Delta = Quill.import('delta')

export class Emoji {
  static toCodePoint (unicodeSurrogates, sep) {
    const r = []
    let c = 0
    let p = 0
    let i = 0
    while (i < unicodeSurrogates.length) {
      c = unicodeSurrogates.charCodeAt(i++)
      if (p) {
        // tslint:disable-next-line:no-bitwise
        r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16))
        p = 0
      }
      else if (0xD800 <= c && c <= 0xDBFF) {
        p = c
      }
      else {
        r.push(c.toString(16))
      }
    }
    return r.join(sep || '-')
  }
  static unicodeToEmoji (unicode) {
    return Emoji.getEmojiDataFromUnified(Emoji.toCodePoint(unicode))
  }
  static emoticonToEmoji (emoticon) {
    return Emoji.getEmojiDataFromEmoticon(emoticon)
  }
  static shortNameToEmoji (shortName) {
    return Emoji.getEmojiDataFromShortName(shortName)
  }
  static getEmojiDataFromUnified (unified) {
    const emoji = Emoji.unified[unified.toUpperCase()]
    return emoji ? emoji : null
  }
  static getEmojiDataFromEmoticon (emoticon) {
    const emoji = Emoji.emoticons[emoticon]
    return emoji ? emoji : null
  }
  static getEmojiDataFromShortName (shortName) {
    const emoji = Emoji.shortNames[shortName.toLowerCase()]
    return emoji ? emoji : null
  }
  static uncompress (list, options) {
    list.map(emoji => {
      const emojiRef = Emoji.unified[emoji.unified] = {
        unified: emoji.unified,
        id: emoji.shortName,
        sheet: emoji.sheet,
        emoticons: emoji.emoticons
      }
      Emoji.shortNames[emoji.shortName] = emojiRef
      // Additional shortNames
      if (emoji.shortNames) {
        for (const d of emoji.shortNames) {
          Emoji.shortNames[d] = emojiRef
        }
      }
      if (options.convertEmoticons && emoji.emoticons) {
        for (const d of emoji.emoticons) {
          Emoji.emoticons[d] = emojiRef
        }
      }
      if (emoji.skinVariations) {
        for (const d of emoji.skinVariations) {
          Emoji.unified[d.unified] = {
            unified: d.unified,
            id: emojiRef.id,
            sheet: d.sheet,
            emoticons: emojiRef.emoticons
          }
        }
      }
    })
    if (options.customEmojiData) {
      for (let customEmoji of options.customEmojiData) {
        if (customEmoji.shortNames) {
          customEmoji = { ...customEmoji, id: customEmoji.shortNames[0] }
          Emoji.shortNames[customEmoji.id] = customEmoji
        }
      }
    }
  }
  static unifiedToNative (unified) {
    const codePoints = unified.split('-').map(u => parseInt(`0x${u}`, 16))
    return String.fromCodePoint(...codePoints)
  }
  static getImageSrc (emoji) {
    return `https://liveonce.ru/img/emoji/lo/48/${emoji.unified.toLowerCase()}.png`
  }
  static emojiSpriteStyles (sheet, set, backgroundImageFn, size = 24, sheetSize = 32, sheetColumns = 57) {
    return {
      width: `${size}px`,
      height: `${size}px`,
      display: 'inline-block',
      'background-image': `url(${backgroundImageFn(set, sheetSize)})`,
      'background-size': `${100 * sheetColumns}%`,
      'background-position': Emoji.getSpritePosition(sheet, sheetColumns),
    }
  }
  static getSpritePosition (sheet, sheetColumns) {
    const [sheetX, sheetY] = sheet
    const multiply = 100 / (sheetColumns - 1)
    return `${multiply * sheetX}% ${multiply * sheetY}%`
  }
  static toHex (str) {
    let hex
    let result = ''
    for (let i = 0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16)
      result += ('000' + hex).slice(-4)
    }
    return result
  }
  static buildImage (emoji, node, options) {
    if (typeof emoji === 'string') {
      const unicodeRegex = unicodeRe()
      if (unicodeRegex.test(emoji)) {
        emoji = Emoji.unicodeToEmoji(emoji)
      }
      else {
        const shortNameRegex = new RegExp(Emoji.shortNameRe)
        const match = shortNameRegex.exec(emoji)
        if (match && match.length > 1) {
          emoji = Emoji.shortNameToEmoji(match[1])
        }
      }
    }

    if (emoji && typeof emoji === 'object') {
      node.classList.add(Emoji.emojiPrefix + emoji.id)
      // let style = null
      // Default emoji using a set
      // if (emoji.sheet) {
      //   style = Emoji.emojiSpriteStyles(emoji.sheet, set, options.backgroundImageFn)
      // }
      // else if (emoji.spriteUrl) { // Emoji using a sprite URL
      //   node.classList.add(Emoji.emojiPrefix + 'custom')
      //   style = Emoji.emojiSpriteStyles([emoji.sheet_x, emoji.sheet_y], '', () => emoji.spriteUrl, 24, emoji.size, emoji.sheetColumns)
      // }
      // if (style) {
      //   node.style.display = 'inline-block'
      //   node.style.backgroundImage = style['background-image']
      //   node.style.backgroundSize = style['background-size']
      //   node.style.backgroundPosition = style['background-position']
      // }
      // node.style.fontSize = 'inherit'
      // node.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
      node.setAttribute('src', Emoji.getImageSrc(emoji))
      node.setAttribute('draggable', 'false')

      if (emoji.unified) {
        const native = Emoji.unifiedToNative(emoji.unified)
        node.setAttribute('alt', native)
      } else {
        node.setAttribute('alt', options.indicator + emoji.id + options.indicator)
      }

      if (options.showTitle) {
        const emoticons = emoji.emoticons
        let title = ''
        if (options.convertEmoticons && emoticons && emoticons.length > 0) {
          title = emoticons[0] + '\u2002,\u2002'
        }
        title += options.indicator + emoji.id + options.indicator
        node.setAttribute('title', title)
      }
    }
    return node
  }
  static convertInput (delta, replacements) {
    // console.log('convertInput > delta', delta)
    const changes = new Delta()
    let position = 0
    delta.ops.forEach((op) => {
      if (op.insert) {
        if (typeof op.insert === 'object') {
          position++
        }
        else if (typeof op.insert === 'string') {
          let text = op.insert
          let raw = text
          let emojiText = ''
          let index
          for (const replacement of replacements) {
            // tslint:disable-next-line: no-conditional-assignment
            while ((replacement.match = raw.match(replacement.regex))) {
              // console.log('convertInput > match', replacement.match);
              // Setting the index and using the difference between the matches as a workaround for a lookahead regex
              index = replacement.match.index + (replacement.match[0].length - replacement.match[replacement.replacementIndex].length)
              emojiText = replacement.match[replacement.matchIndex]
              const emoji = replacement.fn(emojiText)
              const changeIndex = position + index
              if (changeIndex > 0) {
                changes.retain(changeIndex)
              }
              changes.delete(replacement.match[replacement.replacementIndex].length)
              if (emoji) {
                changes.insert({ emoji })
              }
              raw = raw.substr(index + replacement.match[replacement.replacementIndex].length)
              // console.log('convertInput > raw', raw)
            }
          }
          position += op.insert.length
        }
      }
    })
    // console.log('convertInput > changes', new Delta(changes))
    return changes
  }
  static convertPaste (delta, replacements) {
    const changes = new Delta()
    let op = null
    // Matchers are called recursively, so iterating is not necessary
    if (delta) {
      op = delta.ops[0]
    }
    if (op && op.insert && typeof op.insert === 'string') {
      let text = op.insert
      let raw = text
      let emojiText = ''
      let currentReplacement = null
      let index = 0
      let offset = 0
      // console.log('convertPaste > text', text)
      do {
        // Getting our first match
        let tempReplacement = null
        for (const replacement of replacements) {
          // Select the first match in the replacements array
          if (replacement.match === undefined || currentReplacement === replacement) {
            replacement.match = raw.match(replacement.regex)
          }
          if (replacement.match) {
            if (!tempReplacement || !tempReplacement.match ||
              (replacement.match.index < tempReplacement.match.index)) {
              tempReplacement = replacement
            }
          }
        }
        currentReplacement = tempReplacement
        if (currentReplacement && currentReplacement.match) {
          // console.log('convertPaste > match', currentReplacement.match)
          // Setting the index and using the difference between the matches as a workaround for a lookahead regex
          index = currentReplacement.match.index +
            (currentReplacement.match[0].length - currentReplacement.match[currentReplacement.replacementIndex].length)
          if (index > 0) {
            changes.insert(raw.substring(0, index))
          }
          emojiText = currentReplacement.match[currentReplacement.matchIndex]
          const emoji = currentReplacement.fn(emojiText)
          if (emoji) {
            changes.insert({ emoji })
          }
          offset += index + currentReplacement.match[currentReplacement.replacementIndex].length
          // console.log('convertPaste > offset', offset)
          raw = raw.substr(index + currentReplacement.match[currentReplacement.replacementIndex].length)
          // console.log('convertPaste > raw', raw)
        }
      } while (currentReplacement && currentReplacement.match)
      // Check if there is text left
      if (offset < text.length) {
        changes.insert(text.substring(offset))
      }
    }
    return changes
  }
  static insertEmoji (quill, event) {
    if (quill && quill.isEnabled()) {
      const range = quill.getSelection(true)
      const delta = new Delta().retain(range.index).delete(range.length).insert({ emoji: event.emoji })
      // Using silent to not trigger text-change, but checking if the editor is enabled
      quill.updateContents(delta, Quill.sources.SILENT)
      quill.setSelection(++range.index, 0, Quill.sources.SILENT)
    }
  }
}

Emoji.unified = {}
Emoji.emoticons = {}
Emoji.shortNames = {}
Emoji.emojiPrefix = 'qle-'
// tslint:disable-next-line: max-line-length
Emoji.unicodeRe = `(${unicodeRe()})`
Emoji.emoticonRe = `(?:\\s|^)((?:8\\))|(?:\\(:)|(?:\\):)|(?::'\\()|(?::\\()|(?::\\))|(?::\\*)|(?::-\\()|(?::-\\))|(?::-\\*)|(?::-/)|(?::->)|(?::-D)|(?::-O)|(?::-P)|(?::-\\\\)|(?::-b)|(?::-o)|(?::-p)|(?::-\\|)|(?::/)|(?::>)|(?::D)|(?::O)|(?::P)|(?::\\\\)|(?::b)|(?::o)|(?::p)|(?::\\|)|(?:\\))|(?:-\\))|(?:-P)|(?:-b)|(?:-p)|(?:P)|(?:b)|(?:p)|(?:<3)|(?:</3)|(?:=\\))|(?:=-\\))|(?:>:\\()|(?:>:-\\()|(?:C:)|(?:D:)|(?:c:))(?=\\s|$)`
Emoji.shortNameRe = '(?:[^\\*]|^)(\\*([a-z0-9_\\-\\+]+)\\*)(?!\\*)'
