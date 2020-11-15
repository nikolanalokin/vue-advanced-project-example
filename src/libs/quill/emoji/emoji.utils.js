import unicodeRe from 'emoji-regex'
import { Emoji } from './emoji.model'
import { EmojiModule } from './emoji.quill-module'

class EmojiUtils {
  static parse (text, options = {
    convertEmoticons: false,
    convertShortNames: false
  }) {
    const replacements = [
      // Unicode to Emoji
      {
        regex: unicodeRe(),
        matchIndex: 0,
        replacementIndex: 0,
        fn: (str) => Emoji.unicodeToEmoji(str)
      }
    ]
    if (options.convertEmoticons) {
      // Emoticons to Emoji
      replacements.push({
        regex: new RegExp(Emoji.emoticonRe, 'g'),
        matchIndex: 1,
        replacementIndex: 1,
        fn: (str) => Emoji.emoticonToEmoji(str)
      })
    }
    if (options.convertShortNames) {
      // ShortNames to Emoji
      replacements.push({
        regex: new RegExp(Emoji.shortNameRe, 'g'),
        matchIndex: 2,
        replacementIndex: 1,
        fn: (str) => Emoji.shortNameToEmoji(str)
      })
    }
  
    let emojiText = ''
    let index = 0
    let parsed = []

    for (const replacement of replacements) {
      while (replacement.match = replacement.regex.exec(text)) {
        parsed.push({
          tag: 'p',
          inner: text.slice(index, replacement.match.index)
        })
        // Setting the index and using the difference between the matches as a workaround for a lookahead regex
        index = replacement.match.index + (replacement.match[0].length - replacement.match[replacement.replacementIndex].length)
        emojiText = replacement.match[replacement.matchIndex]
        const emoji = replacement.fn(emojiText)

        parsed.push({
          tag: 'emoji',
          inner: emoji
        })

      }
      console.log('convertRaw > parsed >', parsed)
    }

    return parsed
  }
}

export default EmojiUtils