import emojiList from './emoji.data.json'

let emojiMap = []
emojiMap = emojiList.map((emoji) => { 
  return {
    name: emoji.name,
    unified: emoji.unified,
    shortName: emoji.short_name,
    shortNames: emoji.short_names,
    sheet: [emoji.sheet_x, emoji.sheet_y],
    keywords: '',
    hidden: '',
    emoticons: emoji.texts,
    text: emoji.text,
    skinVariations: [],
    obsoletedBy: '',
    obsoletes: '',
    
    image: emoji.image,
    id: emoji.id,
    category: emoji.category,
    sortOrder: emoji.sort_order,
    hasApple: emoji.has_img_apple,
    hasLO: emoji.has_img_lo,
  }
})

export default emojiMap
