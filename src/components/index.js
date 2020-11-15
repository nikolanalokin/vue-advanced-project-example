let modals = {},
    modules = {},
    unique = {},
    ui = {}

let requireComponent = require.context(`./modals`, false, /[A-Z]\w+\.(vue)$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  modals[componentConfig.default.name] = componentConfig.default
})

requireComponent = require.context(`./modules`, false, /[A-Z]\w+\.(vue)$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  modules[componentConfig.default.name] = componentConfig.default
})

requireComponent = require.context(`./unique`, true, /[A-Z]\w+\.(vue)$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  unique[componentConfig.default.name] = componentConfig.default
})

requireComponent = require.context(`./ui`, true, /.\index\.js$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  
  for (let key in componentConfig) {
    ui[key] = componentConfig[key]
  }
})

const components = {
  ...modals,
  ...modules,
  ...unique,
  ...ui
}

export default components