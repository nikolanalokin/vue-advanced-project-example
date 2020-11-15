import { parse } from 'svg-parser'

let icons = {}
let pictures = {}

let iconsRequireContext = require.context(`./icons`, false, /\.svg$/)
let picturesRequireContext = require.context(`./pictures`, false, /\.svg$/)

iconsRequireContext.keys().forEach(fileName => {
  const component = iconsRequireContext(fileName)
  let name = fileName.replace('./', '').replace('.svg', '')
  icons[name] = parse(component.default)
})

picturesRequireContext.keys().forEach(fileName => {
  const component = picturesRequireContext(fileName)
  let name = fileName.replace('./', '').replace('.svg', '')
  pictures[name] = parse(component.default)
})

console.log({
  icons,
  pictures
})

export default {
  icons,
  pictures
}