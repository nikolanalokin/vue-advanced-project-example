import * as types from '../mutation-types'
import API from '../../services/api'
import { getLinkByData } from '../../utils'
import { DateTime } from 'luxon'

import debug from 'debug'
const logger = debug('store:viewer')

export default {
  state: () => ({
    type: '',
    subtype: '',

    opened: false,

    list: [],
    index: null,

    dataLoading: false,

    photoLoading: false,
    likeProcess: false,
    deleteProcess: false,
    addProcess: false,

    lastOwnerId: null,
    headerData: {
      title: '',
      photo: '',
      link: ''
    },

    photoOptions: {
      id: null,
      aid: null,
      oid: null,
      woid: null,
      wid: null,
      coid: null,
      cid: null,
      total: null,
    },
    videoOptions: {
      id: null,
      oid: null,
      seriesId: null,
      seasonId: null,
      total: null,
    },

    id: null,
    aid: null,
    oid: null,
    woid: null,
    wid: null,
    total: null,
  }),
  mutations: {
    [types.VIEWER_LOADING_START] (state) {
      state.photoLoading = true
    },
    [types.VIEWER_LOADING_FINISH] (state) {
      state.photoLoading = false
    },
    [types.VIEWER_CURRENT_LIKES_ADD] (state) {
      state.list[state.index].likes.count++
    },
    [types.VIEWER_CURRENT_LIKES_REMOVE] (state) {
      state.list[state.index].likes.count--
    },
    [types.VIEWER_CURRENT_LIKED] (state, value) {
      state.list[state.index].likes.isLike = value == true ? 1 : value == false ? 0 : value == 1 || value == 0 ? value : null
    },
    [types.VIEWER_CURRENT_SET_ADDED] (state, value) {
      state.list[state.index].is_add = value == true ? 1 : value == false ? 0 : value == 1 || value == 0 ? value : null
    },
    [types.VIEWER_CURRENT_SET_DELETED] (state, value) {
      if (state.list[state.index].deleted === undefined) this._vm.$set(state.list[state.index], 'deleted', false)
      state.list[state.index].deleted = value == true ? 1 : value == false ? 0 : value == 1 || value == 0 ? value : null
    },
  },
  actions: {
    async [types.VIEWER_OPEN] ({ state, commit, getters, dispatch, rootState }, { type, subtype, index, list, items, viewer, total, aid, id, oid, woid, wid, coid, cid, seriesId, seasonId, uploaded }) {
      if (process.env.NODE_ENV == 'development') logger('open obj %O', {
        type: type,
        subtype: subtype,
        index: index,
        list: list,
        viewer: viewer,
        total: total,
        aid: aid,
        id: id,
        oid: oid,
        woid: woid,
        wid: wid,
        coid: coid,
        cid: cid,
        seriesId: seriesId,
        seasonId: seasonId
      });

      state.type = type
      state.subtype = subtype || ''

      if (state.type == 'photo') {
        /* state.id = +id
        state.aid = aid
        state.oid = +oid
        state.total = +total
        state.woid = +woid
        state.wid = +wid */

        state.photoOptions = {
          id: +id,
          aid,
          oid: +oid,
          total: +total,
          woid: +woid,
          wid: +wid,
          coid: +coid,
          cid: +cid,
          items: items
        }

        state.opened = true

        state.dataLoading = true
        await dispatch(types.VIEWER_UPDATE_CURRENT_PHOTOS_LIST)
        state.dataLoading = false

        state.index = state.photoOptions.id ? state.list.findIndex(item => +item.id == state.photoOptions.id) : 0

        if (process.env.NODE_ENV == 'development') logger(state.list, state.index);
      } else if (state.type == 'video') {
        state.videoOptions = {
          id: +id,
          oid: +oid,
          woid: +woid,
          wid: +wid,
          seriesId: +seriesId,
          seasonId: +seasonId,
          total: +total,
          uploaded,
          items: items
        }
        
        state.opened = true

        state.dataLoading = true
        await dispatch(types.VIEWER_UPDATE_CURRENT_VIDEOS_LIST)
        state.dataLoading = false

        state.index = state.videoOptions.id ? state.list.findIndex(item => +item.id == state.videoOptions.id) : 0

        if (process.env.NODE_ENV == 'development') logger(state.list, state.index);
        if (getters.mpIsPlaying) {
          dispatch(types.MP_PAUSE)
          commit(types.SET_PAUSING_STATUS, true)
        }
      }

      document.querySelector('body').style.overflow = 'hidden'
      dispatch(types.VIEWER_GET_HEADER_DATA)
    },
    [types.VIEWER_CLOSE] ({ state, commit, dispatch, getters }) {
      if (!state.opened) return false

      state.opened = false
      document.querySelector('body').style.overflow = ''
      
      if (getters.mpIsPaused && state.type == 'video') {
        dispatch(types.MP_PLAY)
        commit(types.SET_PAUSING_STATUS, false)
      }

      state.type = ''
      state.subtype = ''
      state.id = null
      state.aid = null
      state.oid = null
      state.woid = null
      state.wid = null
      state.total = null
      state.list = []
      state.index = null

      state.photoOptions = {}
      state.videoOptions = {}
    },
    [types.VIEWER_NEXT] ({ state, commit, getters, dispatch }) {
      if (!getters.viewerCurrentItemIsLast) {
        state.index++
        if (state.type == 'photo') commit(types.VIEWER_LOADING_START)
        dispatch(types.VIEWER_GET_HEADER_DATA)
        return true
      } else return false
    },
    [types.VIEWER_PREV] ({ state, commit, getters, dispatch }) {
      if (!getters.viewerCurrentItemIsFirst) {
        state.index--
        if (state.type == 'photo') commit(types.VIEWER_LOADING_START)
        dispatch(types.VIEWER_GET_HEADER_DATA)
        return true
      } else return false
    },

    async [types.VIEWER_UPDATE_CURRENT_PHOTOS_LIST] ({ state, dispatch, getters }) {
      let response

      if (state.photoOptions.items) {
        state.list = state.photoOptions.items
      }
      else if (state.photoOptions.aid == 'all') {
        response = await API.photos.getAll({
          owner_id: state.photoOptions.oid,
          count: state.photoOptions.total,
          extended: 1,
        })
        state.list = response.items
      }
      else if (state.photoOptions.wid || state.photoOptions.aid == 'wall' || state.photoOptions.aid == 'newsfeed') {
        response = await API.wall.getById({
          posts: `${state.photoOptions.woid}_${state.photoOptions.wid}`
        })
        state.list = response.items[0].attachments.photo
      }
      else if (state.photoOptions.aid == 'message') {
        
      }
      else if (typeof +state.photoOptions.aid == 'number') {
        response = await API.photos.get({
          owner_id: state.photoOptions.oid,
          album_id: state.photoOptions.aid,
          count: state.photoOptions.total,
          extended: 1,
        })
        state.list = response.items
      }
    },
    
    async [types.VIEWER_UPDATE_CURRENT_VIDEOS_LIST] ({ state, dispatch, getters }) {
      let response

      if (state.videoOptions.items) {
        state.list = state.videoOptions.items
      }
      else if (state.subtype == 'series') {
        let seasonsList = [], videosObj = {}, videosList = []

        try {
          response = await API.video.getSeriesSeasons({
            series_id: state.videoOptions.seriesId
          })
          seasonsList = response

          for (let season of seasonsList) {
            try {
              response = await API.video.getSeasonsFilms({
                season_id: season.id
              })
              
              // todo
              // state.videoOptions.seasonId
              // videosObj[number] = {
              //   id: state.videoOptions.seasonId,
              //   items: response
              // }
  
              videosList.push(...response)
            } catch (err) {
              throw new Error(err)
            }
          }

          state.list = videosList
        } catch (err) {
          console.warn(err);
        }
      }
      else if (state.subtype == 'film') {
        try {
          response = await API.video.getFilmsById({
            film_ids: state.videoOptions.id
          })
          state.list = response
        } catch (err) {
          console.warn(err)
        }
      }
      else if (state.videoOptions.wid) {
        response = await API.wall.getById({
          posts: `${state.videoOptions.woid}_${state.videoOptions.wid}`
        })
        state.list = response.items[0].attachments.video
      }
      else {
        response = await API.video[state.videoOptions.uploaded ? 'get' : 'getList']({
          owner_id: state.videoOptions.oid,
          type: 'video',
          count: state.videoOptions.total,
        })

        state.list = response.items
      }
    },

    async [types.VIEWER_GET_HEADER_DATA] ({ state, commit, getters }) {

      if (state.lastOwnerId == getters.viewerCurrentItemData.owner_id || !getters.viewerCurrentItemData.owner_id) return

      let response, title, photo, link
      
      if (getters.viewerCurrentItemData.owner_id > 0) {
        response = await API.users.get({
          user_ids: getters.viewerCurrentItemData.owner_id,
          fields: 'photo'
        })
        title = `${response.items[0].first_name} ${response.items[0].last_name}`
        link = getLinkByData(response.items[0], -1)
        photo = response.items[0].photo && response.items[0].photo[100]
      } else {
        response = await API.unions.communitiesGetById({
          community_ids: Math.abs(getters.viewerCurrentItemData.owner_id),
          fields: 'photo'
        })
        if (!response) {
          response = await API.unions.placesGetById({
            place_ids: Math.abs(getters.viewerCurrentItemData.owner_id),
            fields: 'photo'
          })
          if (!response) {
            response = await API.unions.eventsGetById({
              event_ids: Math.abs(getters.viewerCurrentItemData.owner_id),
              fields: 'photo'
            })
            link = getLinkByData(response[0], 2)
          } else {
            link = getLinkByData(response[0], 1)
          }
        } else {
          link = getLinkByData(response[0], 0)
        }
        title = `${response[0].name}`
        photo = response[0].photo && response[0].photo[100]
      }

      state.headerData = { title, photo, link }
      state.lastOwnerId = getters.viewerCurrentItemData.owner_id
    },
    
    async [types.VIEWER_ON_LIKE_DISLIKE] ({ state, commit, getters, rootState }) {
      if (!getters.isAuthenticated) return false
      
      state.likeProcess = true
      try {
        if (!getters.viewerCurrentItemLiked) {
          let response = await API.likes.add({
            type: state.type, 
            item_id: getters.viewerCurrentItemData.id
          })
          commit(types.VIEWER_CURRENT_LIKES_ADD)
          commit(types.VIEWER_CURRENT_LIKED, true)
        } else {
          let response = await API.likes.remove({
            type: state.type, 
            item_id: getters.viewerCurrentItemData.id
          })
          commit(types.VIEWER_CURRENT_LIKES_REMOVE)
          commit(types.VIEWER_CURRENT_LIKED, false)
        }
      } catch (error) {
        console.warn(error)
      } finally {
        state.likeProcess = false
      }
    },
    async [types.VIEWER_ON_DELETE_RESTORE] ({ state, commit, getters }) {
      state.deleteProcess = true
      if (!getters.viewerCurrentItemIsDeleted) {
        try {
          let response = await API.photos.remove({
            photo_id: getters.viewerCurrentItemData.id,
            owner_id: getters.viewerCurrentItemData.owner_id
          })
          if (response.response == 1) {
            this._vm.$notify({
              type: 'success',
              text: 'Фотография успешно удалёна'
            })
            commit(types.VIEWER_CURRENT_SET_DELETED, true)
          } else {
            this._vm.$notify({
              type: 'warn',
              text: 'Не удалось удалить фотографию'
            })
          }
        } catch(error) {
          this._vm.$notify({
            type: 'error',
            text: 'Не удалось удалить фотографию'
          })
          console.warn(error);
        } finally {
          state.deleteProcess = false
        }
      } else {
        try {
          let response = await API.photos.restore({
            photo_id: getters.viewerCurrentItemData.id,
            owner_id: getters.viewerCurrentItemData.owner_id
          })
          if (response.response == 1) {
            this._vm.$notify({
              type: 'success',
              text: 'Фотография успешно восстановлена'
            })
            commit(types.VIEWER_CURRENT_SET_DELETED, false)
          } else {
            this._vm.$notify({
              type: 'warn',
              text: 'Не удалось восстановить фотографию'
            })
          }
        } catch(error) {
          this._vm.$notify({
            type: 'error',
            text: 'Не удалось восстановить фотографию'
          })
          console.warn(error);
        } finally {
          state.deleteProcess = false
        }
      }
    },
    async [types.VIEWER_ON_ADD_REMOVE] ({ state, commit, getters }) {
      state.addProcess = true
      try {
        if (!getters.viewerCurrentItemIsAdded) {
          let response = await API.video.addToList({
            item_id: getters.viewerCurrentItemData.id,
            type: 'video',
            owner_id: getters.uid
          })
          
          if (response.response == 1) {
            this._vm.$notify({
              type: 'success',
              text: 'Видео успешно добавлено'
            })
            commit(types.VIEWER_CURRENT_SET_ADDED, true)
          } else {
            this._vm.$notify({
              type: 'warn',
              text: 'Не удалось добавить видео'
            })
          }
        } else {
          let response = await API.video.deleteFromList({
            item_id: getters.viewerCurrentItemData.id, 
            type: 'video',
            owner_id: getters.uid
          })
          if (response.response == 1) {
            this._vm.$notify({
              type: 'success',
              text: 'Видео успешно удалено'
            })
            commit(types.VIEWER_CURRENT_SET_ADDED, false)
          } else {
            this._vm.$notify({
              type: 'warn',
              text: 'Не удалось удалить видео'
            })
          }
        }
      } catch (error) {
        console.warn(error)
      } finally {
        state.addProcess = false
      }
    },

    /**
     * deprecated
     */
    async [types.VIEWER_LOAD_PHOTOS_DATA] ({ state, dispatch, getters }, { oid, aid, id }) {
      state.photoOptions = {
        oid: +oid,
        aid: +aid,
        id: +id
      }

      await dispatch(types.VIEWER_UPDATE_CURRENT_PHOTOS_LIST)

      state.index = state.list.findIndex(item => +item.id == state.photoOptions.id)

      await dispatch(types.VIEWER_GET_HEADER_DATA)
    },
  },
  getters: {
    viewerType: state => {
      return state.type
    },
    viewerIsPhoto: state => {
      return state.type == 'photo'
    },
    viewerIsVideo: state => {
      return state.type == 'video'
    },
    viewerSubtypeIsVideo: (state, getters) => {
      return state.subtype == 'video'
    },
    viewerIsFilm: state => {
      return state.subtype == 'film' || state.subtype == 'cartoon'
    },
    viewerIsSeries: state => {
      return state.subtype == 'series' || state.subtype == 'cartoonSeries'
    },
    viewerOpened: state => {
      return state.opened
    },
    viewerPrevItemData: state => {
      return state.list[state.index - 1] || {}
    },
    viewerCurrentItemData: state => {
      return state.list[state.index] || {}
    },
    viewerCurrentItemIsDeleted: (state, getters) => {
      return getters.viewerCurrentItemData.deleted
    },
    viewerCurrentItemIsAdded: (state, getters) => {
      return !!+getters.viewerCurrentItemData.is_add
    },
    viewerCurrentPhotoFromSystem: (state, getters) => {
      return getters.viewerIsPhoto ? typeof state.photoOptions.aid == 'number' && state.photoOptions.aid < 0 : null
    },
    viewerNextItemData: state => {
      return state.list[state.index + 1] || {}
    },
    viewerCurrentItemIsFirst: state => {
      return state.index == 0
    },
    viewerCurrentItemIsLast: state => {
      return state.index == state.list.length - 1
    },
    viewerCurrentItemIndex: state => {
      return state.index
    },
    viewerCurrentPostTime: (state, getters) => {
      return getters.viewerCurrentItemData.date ? DateTime.fromSeconds(+getters.viewerCurrentItemData.date).toFormat("DDD 'в' H:mm") : ''
    },
    viewerCurrentItemLink: (state, getters) => {
      if (!getters.viewerCurrentItemData.id) return
      if (state.type == 'photo') {
        return {
          name: 'photo',
          params: {
            id: +getters.viewerCurrentItemData.id,
            aid: +getters.viewerCurrentItemData.album_id,
            oid: +getters.viewerCurrentItemData.owner_id
          }
        }
      }
      if (state.type == 'video') {
        return {
          name: 'video',
          params: {
            id: +getters.viewerCurrentItemData.id,
            oid: +getters.viewerCurrentItemData.owner_id
          }
        }
      }
      return ''
    },
    viewerCurrentItemLiked: (state, getters) => {
      return getters.viewerCurrentItemData.likes && !!getters.viewerCurrentItemData.likes.isLike
    },
    viewerCurrentItemLikes: (state, getters) => {
      return getters.viewerCurrentItemData.likes && +getters.viewerCurrentItemData.likes.count
    },
    viewerCurrentItemCanViewLikes: (state, getters) => {
      return getters.viewerCurrentItemData.likes && !!getters.viewerCurrentItemData.likes.can_view
    },
    viewerCurrentItemLikeProcess: (state, getters) => {
      return state.likeProcess
    },
    viewerCurrentItemDeleteProcess: (state, getters) => {
      return state.deleteProcess
    },
    viewerCurrentItemAddProcess: (state, getters) => {
      return state.addProcess
    },
    viewerCurrentItemComments: (state, getters) => {
      return getters.viewerCurrentItemData.comments && +getters.viewerCurrentItemData.comments.count
    },
    viewerCurrentPhotoOriginalSrc: (state, getters) => {
      if (!getters.viewerCurrentItemData.sizes) return ''

      let original = getters.viewerCurrentItemData.sizes.find(item => item.size == 'original' || item.size == 0)
      return original.url
    },
    viewerCurrentItemCanComment: (state, getters) => {
      return true // !!getters.viewerCurrentItemData.comments.canComment
    },
    viewerCurrentList: state => {
      return state.list
    },
    viewerCurrentListLength: state => {
      return state.list.length
    },
    viewerPhotoLoading: state => {
      return state.photoLoading
    },
    viewerDataLoading: state => {
      return state.dataLoading
    },
    viewerHeaderData: state => {
      return state.headerData
    },
  }
}