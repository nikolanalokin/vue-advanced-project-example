import API from '../../services/api'

import debug from 'debug'
const logger = debug('store:prefetch')

const FIELDS = {
  user: 'deleted,blocked,last_visit,status,photo,marital_status,birthday,birthday_privacy,country_city_name,relatives,contacts,interests,education,higher_education,career,military,position,counters,country,city,sex',
}

export default {
  state: {
    userProfileData: {},
  },
  mutations: {},
  actions: {
    async loadUserProfileData ({ state }, id) {
      try {
        let response = await API.users.get({
          user_ids: id,
          system_info: 1,
          fields: FIELDS.user
        })

        state.userProfileData = {
          response,
          data: response.items[0]
        }

        return state.userProfileData
      } catch (err) {
        throw err
      }
    }
  },
  getters: {
    userProfileData (state) { return state.userProfileData }
  }
}