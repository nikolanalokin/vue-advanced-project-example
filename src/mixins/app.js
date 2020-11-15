export default {
  computed: {
    $isProduction () {
      return process.env.NODE_ENV == 'production'
    },
    $isDevelopment () {
      return process.env.NODE_ENV == 'development'
    },
    $isTest () {
      return process.env.NODE_ENV == 'test'
    },
  },
}