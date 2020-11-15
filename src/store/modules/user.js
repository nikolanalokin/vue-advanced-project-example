import * as types from '../mutation-types'
import API from '../../services/api'
import { pick } from 'lodash'

import debug from 'debug'
import { tsNow } from '../../utils'
const logger = debug('store:user')

export default {
  state: () => ({
    userData: {},
    userSystemData: null,
    currentCountry: null,
    currentCity: null,
    adminCommunities: [],
    adminPlaces: [],
    adminEvents: [],
    tsLastActivity: null
  }),
  mutations: {

    [types.USER_SET_DATA] (state, value) {
      state.userData = value
      localStorage.setItem('user_data', JSON.stringify(value))
    },

    [types.USER_SET_SYSTEM_DATA] (state, value) {
      state.userSystemData = value
      localStorage.setItem('user_system_data', JSON.stringify(value))
    },

    [types.USER_SET_COUNTRY] (state, value) {
      state.currentCountry = value
      localStorage.setItem('u:cur_country', JSON.stringify(value))
    },

    [types.USER_SET_CITY] (state, value) {
      state.currentCity = value
      localStorage.setItem('u:cur_city', JSON.stringify(value))
    },

    [types.USER_SET_ADMIN_COMMUNITIES] (state, value) {
      state.adminCommunities = value
      localStorage.setItem('user_admin_communities', JSON.stringify(value))
    },

    [types.USER_SET_ADMIN_PLACES] (state, value) {
      state.adminPlaces = value
      localStorage.setItem('user_admin_places', JSON.stringify(value))
    },

    [types.USER_SET_ADMIN_EVENTS] (state, value) {
      state.adminEvents = value
      localStorage.setItem('user_admin_events', JSON.stringify(value))
    },

    [types.USER_CLEAR_DATA] (state) {
      state.userData = null
      state.adminCommunities = null
      state.adminPlaces = null
      state.adminEvents = null
      state.currentCountry = null
      state.currentCity = null
      state.tsLastActivity = null

      localStorage.removeItem('user_data')
      localStorage.removeItem('user_admin_communities')
      localStorage.removeItem('user_admin_places')
      localStorage.removeItem('user_admin_events')
      localStorage.removeItem('u:cur_country')
      localStorage.removeItem('u:cur_city')
      localStorage.removeItem('last_activity')
    }
  },
  actions: {
    async [types.USER_LOAD_SELF_DATA] ({ commit, getters }) {
      try {
        let response = await API.users.get({
          user_ids: getters.uid,
          fields: 'last_visit,status,sex,photo,marital_status,birthday,birthday_privacy,city,country,country_city_name,relatives,contacts,interests,education,higher_education,career,military,position,counters',
          system_info: 0
        })

        commit(types.USER_SET_DATA, response.items[0])
      } catch (err) {
        throw err
      }
    },

    async [types.USER_LOAD_SYSTEM_DATA] ({ commit, getters }) {
      try {
        let response = await API.users.get({
          user_ids: getters.uid,
          fields: 'last_visit,status,sex,photo,marital_status,birthday,birthday_privacy,city,country,country_city_name,relatives,contacts,interests,education,higher_education,career,military,position,counters',
          system_info: 1
        })

        commit(types.USER_SET_SYSTEM_DATA, response.system_info)
      } catch (error) {
        throw err
      }
    },

    async [types.USER_LOAD_ADMIN_COMMUNITIES] ({ commit, getters }) {
      try {
        let response = await API.unions.get({
          user_id: getters.uid,
          type: 0,
          filter: 'admin',
          fields: 'photo,type'
        })
        commit(types.USER_SET_ADMIN_COMMUNITIES, response.items)
      } catch (err) {
        throw err
      }
    },
    
    async [types.USER_LOAD_ADMIN_PLACES] ({ commit, getters }) {
      try {
        let response = await API.unions.get({
          user_id: getters.uid,
          type: 1,
          filter: 'admin',
          fields: 'photo,type'
        })
        commit(types.USER_SET_ADMIN_PLACES, response.items)
      } catch (err) {
        throw err
      }
    },
    
    async [types.USER_LOAD_ADMIN_EVENTS] ({ commit, getters }) {
      try {
        let response = await API.unions.get({
          user_id: getters.uid,
          type: 2,
          filter: 'admin',
          fields: 'photo,type'
        })
        commit(types.USER_SET_ADMIN_EVENTS, response.items)
      } catch (err) {
        throw err
      }
    },

    async [types.USER_UPDATE_COUNTRY] ({ state, commit }, id) {
      id = id || (state.userData && +state.userData.contacts.country)
      if (id) {
        try {
          let response = await API.database.getCountriesById({
            country_ids: id
          })

          commit(types.USER_SET_COUNTRY, response[0])
        } catch (err) {
          throw err
        }
      }
    },

    async [types.USER_UPDATE_CITY] ({ state, commit }, id) {
      id = id || (state.userData && +state.userData.contacts.city)
      if (id) {
        try {
          let response = await API.database.getCitiesById({
            city_ids: id
          })
          commit(types.USER_SET_CITY, response[0])
        } catch (err) {
          throw err
        }
      }
    },

    async [types.USER_INIT] ({ commit, state, dispatch, getters }) {
      if (getters.isAuthenticated) {
        let ps1 = [], ps2 = []
        if (localStorage.getItem('user_data')) state.userData = JSON.parse(localStorage.getItem('user_data'))
        else ps1.push(dispatch(types.USER_LOAD_SELF_DATA))
        if (localStorage.getItem('user_system_data')) state.userSystemData = JSON.parse(localStorage.getItem('user_system_data'))
        else ps1.push(dispatch(types.USER_LOAD_SYSTEM_DATA))
        if (localStorage.getItem('user_admin_communities')) state.adminCommunities = JSON.parse(localStorage.getItem('user_admin_communities'))
        else ps1.push(dispatch(types.USER_LOAD_ADMIN_COMMUNITIES))
        if (localStorage.getItem('user_admin_places')) state.adminPlaces = JSON.parse(localStorage.getItem('user_admin_places'))
        else ps1.push(dispatch(types.USER_LOAD_ADMIN_PLACES))
        if (localStorage.getItem('user_admin_events')) state.adminEvents = JSON.parse(localStorage.getItem('user_admin_events'))
        else ps1.push(dispatch(types.USER_LOAD_ADMIN_EVENTS))
        if (localStorage.getItem('u:cur_country')) state.currentCountry = JSON.parse(localStorage.getItem('u:cur_country'))
        else ps2.push(dispatch(types.USER_UPDATE_COUNTRY))
        if (localStorage.getItem('u:cur_city')) state.currentCity = JSON.parse(localStorage.getItem('u:cur_city'))
        else ps2.push(dispatch(types.USER_UPDATE_CITY))
        
        try {
          await Promise.all(ps1)
          await Promise.all(ps2)
        } catch (err) {
          console.warn(err)
        }
      }
    },
  },
  getters: {
    currentCountry: state => state.currentCountry,
    currentCity: state => state.currentCity,
    currentUser: state => state.userData,
    currentUserShort: state => pick(state.userData, ['first_name', 'last_name', 'photo', 'id', 'screen_name']),
    userSystemData: state => state.userSystemData,
    adminUnions: state => {
      return state.adminCommunities.concat(state.adminPlaces, state.adminEvents)
    },
    adminUnionIds: state => {
      let ids = state.adminCommunities.map(item => +item.id)
          ids = ids.concat(state.adminPlaces.map(item => +item.id))
          ids = ids.concat(state.adminEvents.map(item => +item.id))
      
      return ids
    },
  }
}