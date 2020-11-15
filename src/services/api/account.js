import HTTP from '../http'
import { getFormDataObj, getValuesAsString } from '../../utils'
import debug from 'debug'

const entries = 'account'
const logger = debug(`api:${entries}`)

/**
 * Изменяет время последнего посещения на текущее время
 * 
 * Метод: POST, требуется авторизация
 */
export async function setOnline () {

  try {

    const response = await new HTTP().post(`${entries}.setOnline`)

    if (process.env.NODE_ENV == 'development') logger(`setOnline`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Изменяет время последнего посещения на: текущее время - 15 минут
 * 
 * Метод: POST, требуется авторизация
 */
export async function setOffline () {

  try {
    const response = await new HTTP().post(`${entries}.setOffline`)

    if (process.env.NODE_ENV == 'development') logger(`setOffline`, response.data.data);

    return response.data.data    
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает настройки аккаунта
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - метод не принимает параметров
 * 
 * В ответе возвращаются поля:
 * 
 * - screen_name
 * - email
 * - phone
 * - password_date
 * 
 */
export async function getSettings () {

  try {
    const response = await new HTTP().get(`${entries}.getSettings`, {
      params: {
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getSettings`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование настроек аккаунта "Общее"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - password_old
 * - password
 * - email
 * - phone
 * - address
 * 
 */
export async function editSettings ({ password_old, password, email, phone, address }) {

  try {
    const response = await new HTTP().post(`${entries}.editSettings`,
      getFormDataObj({
        password_old, password, email, phone, address
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editSettings`, response.data.data);

    return response.data.data    
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Получение настроек аккаунта "Приватность"
 * 
 * Метод: GET, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - system_info - текстовые значения select полей
 */
export async function getSettingsPrivacy ({ system_info }) {

  try {
    const response = await new HTTP().get(`${entries}.getSettingsPrivacy`, {
      params: {
        system_info
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getSettingsPrivacy`, response.data.data);

    return response.data.data   
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование настроек аккаунта "Приватность"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - info_view
 * - photos_view
 * - communities_view
 * - music_view
 * - gifts_view
 * - wall_alien_view
 * - wall_send
 * - comments_view
 * - comments_send
 * - messages_send
 * - communities_invite
 * - page_view
 * 
 */
export async function editSettingsPrivacy ({ info_view, photos_view, communities_view, music_view, gifts_view, wall_alien_view, wall_send, comments_view, comments_send, messages_send, communities_invite, page_view }) {

  try {
    const response = await new HTTP().post(`${entries}.editSettingsPrivacy`,
      getFormDataObj({
        info_view, photos_view, communities_view, music_view, gifts_view, wall_alien_view, wall_send, comments_view, comments_send, messages_send, communities_invite, page_view
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editSettingsPrivacy`, response.data.data);

    return response.data.data    
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * В планах
 */
export async function getActivityHistory () {

  // try {
  //   const response = await new HTTP().get(`${entries}.getActivityHistory`, {
  //     params: {
  //       client_id: 1
  //     }
  //   })

  //   if (process.env.NODE_ENV == 'development') logger(`getActivityHistory`, response.data.data);

  //   return response.data.data   
  // } catch (error) {
  //   throw new Error(error)
  // }
}
/**
 * В планах
 */
export async function resetActivityHistory () {

  // try {
  //   const response = await new HTTP().post(`${entries}.resetActivityHistory`,
  //     getFormDataObj({
  //       client_id: 1,
  //     })
  //   )

  //   if (process.env.NODE_ENV == 'development') logger(`resetActivityHistory`, response.data.data);

  //   return response.data.data    
  // } catch (error) {
  //   throw new Error(error)
  // }
}
/**
 * Возвращает список пользователей, находящихся в черном списке
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - offset - смещение, необходимое для выборки определенного подмножества черного списка
 * - count - количество объектов, информацию о которых необходимо вернуть
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - count - кол-во заблокированных пользователей
 * - item - объекты пользователей
 * 
 */
export async function getBanned ({ offset = 0, count = 50, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.getBanned`, {
      params: {
        offset, 
        count, 
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getBanned`, response.data.data);

    return response.data.data   
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Добавляет пользователя в черный список.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - owner_id - идентификатор пользователя, которого нужно добавить в черный список
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - response = 1
 * 
 */
export async function ban ({ owner_id }) {

  try {
    const response = await new HTTP().post(`${entries}.ban`,
      getFormDataObj({
        owner_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`ban`, response.data.data);

    return response.data.data    
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Удаляет пользователя из черного списка
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - owner_id - идентификатор пользователя, которого нужно удалить из черного списка
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - response = 1
 * 
 */
export async function unban ({ owner_id }) {

  try {
    const response = await new HTTP().post(`${entries}.unban`,
      getFormDataObj({
        owner_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`unban`, response.data.data);

    return response.data.data    
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает счетчики уведомлений
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - метод не принимает параметров
 * 
 * В ответе возвращаются поля:
 * 
 * - unread_conversations - кол-во непрочитанных бесед
 * - friends_requests_in - кол-во заявок в контакты
 * - invite_communities - кол-во приглашений в сообщества
 * - invite_places - кол-во приглашений в места
 * - invite_events - кол-во приглашений в события
 * 
 */
export async function getCounters () {

  try {
    const response = await new HTTP().get(`${entries}.getCounters`)

    if (process.env.NODE_ENV == 'development') logger(`getCounters`, response.data.data);

    return response.data.data   
  } catch (error) {
    throw new Error(error)
  }
}