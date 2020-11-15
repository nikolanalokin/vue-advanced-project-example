import HTTP from '../http'
import { getFormDataObj, getValuesAsString } from '../../utils'
import debug from 'debug'

const entries = 'unions'
const logger = debug(`api:${entries}`)

/**
 * Увеличивает счетчик посещений сообщества (для формирования избранных сообществ)
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества
 * 
 */
export async function addView ({ union_id }) {
  try {
    const response = await new HTTP().post(`${entries}.addView`,
      getFormDataObj({
        union_id
      })
    )

    if (process.env.VUE_APP_DEBUG === 'true') logger(`addView`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- ИНФОРМАЦИЯ -------------------------------------------------- */
/**
 * Возвращает список идентификаторов сообществ пользователя или расширенную информацию о сообществах пользователя (при использовании параметра fields).
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - user_id - идентификатор пользователя, для которого необходимо получить список сообществ. 
 *             Если параметр не задан, то считается, что он равен идентификатору текущего пользователя
 * - type - тип сообщества (0 - community, 1 - place, 2 - event)
 * - filter - список фильтров сообществ. Доступны значения admin, editor, moder. 
 *            По умолчанию возвращаются все сообщества пользователя.
 * - count - количество сообществ, которое нужно вернуть (по умолчанию - 1000)
 * - search - поиск по названию 
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 *   FIELDS:
 * - status
 * - description
 * - website
 * - photo
 * - cover
 * - category
 * - age_limits
 * - country_id
 * - city_id
 * - approved
 * - verified
 * - sections
 * - counters
 * - contacts
 * - links
 * - is_admin - является ли текущий пользователь руководителем
 * - admin_level - (1 - Администратор, 2 - Редактор, 3 - Модератор, 7 - Создатель)
 * 
 * - working_hours - время работы (для мест)
 * - features - функции (для мест)
 * 
 * - full_address - полный адрес (для мест и событий)
 * 
 * - time_start - время начала (для событий)
 * - time_end - время окончания (для событий)
 * 
 */
export async function get ({ user_id, type, filter, count, search, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.get`, {
      params: {
        user_id,
        type,
        filter,
        count,
        search,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`get`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает музыкальные сообщества (артисты, лейблы, радио)
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - category - artist, label, radio
 * 
 * не обязательные поля:
 * 
 * - user_id - id пользователя
 * - search - поиск по названию 
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * - count - количество
 * 
 */
export async function getMusicCommunities ({ category, user_id, search, offset, count, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.getMusicCommunities`, {
      params: {
        category,
        user_id,
        search,
        offset,
        count,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getMusicCommunities`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Осуществляет поиск сообществ по заданной подстроке.
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - q - текст поискового запроса. 
 * - type - тип сообщества. Возможные значения: 0 - communities, 1 - places, 2 - events.
 * - only_owner - 1 - поиск среди сообществ пользователя
 * - country_id - идентификатор страны
 * - city_id - идентификатор города
 * - count - количество сообществ, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function search ({ type, only_owner = 0, country_id, city_id, count, offset, fields, q }) {

  try {
    const response = await new HTTP().get(`${entries}.search`, {
      params: {
        type,
        only_owner,
        country_id,
        city_id,
        count,
        offset,
        fields: getValuesAsString(fields),
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`search`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает список сфер
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - type - тип сообщества (0 - community, 1 - place, 2 - event)
 * 
 */
export async function getSpheres ({ type }) {

  try {
    const response = await new HTTP().get(`${entries}.getSpheres`, {
      params: {
        type
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getSpheres`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- РАЗДЕЛЫ -------------------------------------------------- */
/**
 * Получает информацию о разделах сообщества
 * 
 * Метод: GET
 */
export async function getSections ({ type, only_owner = 0, country_id, city_id, count, offset, fields, q }) {

  try {
    const response = await new HTTP().get(`${entries}.getSections`, {
      params: {
        
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getSections`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует информацию о разделах сообщества.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательно)
 * - posts - лента
 * - albums - альбомы
 * - videos - видео
 * - audios - музыка
 * - contacts - контакты
 * - links - ссылки
 * - comments - комментарии
 * - messages - сообщения
 * 
 * - events - события
 * - radios - радиостанции
 * - stocks - акции
 * - lives - онлайн-трансляции
 * - stickers - стикеры
 * 
 * В случае успеха возвращается:
 * 
 * - response = 1
 */
export async function editSections ({ union_id, posts, albums, videos, audios, contacts, links, comments, messages, events, radios, stocks, lives, stickers }) {

  try {

    const response = await new HTTP().post(`${entries}.editSections`, 
      getFormDataObj({
        union_id,
        posts,
        albums,
        videos,
        audios,
        contacts,
        links,
        events,
        comments,
        messages,
        events,
        radios,
        stocks,
        lives,
        stickers
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editSections`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- УЧАСТНИКИ -------------------------------------------------- */
/**
 * Возвращает список участников сообщества
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор объединения
 * 
 * - sort - сортировка, с которой необходимо вернуть список участников. Может принимать значения:
 * -- id_asc — в порядке возрастания id;
 * -- id_desc — в порядке убывания id;
 * -- time_asc — в хронологическом порядке по вступлению в сообщество;
 * -- time_desc — в антихронологическом порядке по вступлению в сообщество.
 *  
 * Сортировка по time_asc и time_desc возможна только при вызове от модератора сообщества. 
 * 
 * - filter:
 * -- friends — будут возвращены только друзья в этом сообществе.
 * -- managers — будут возвращены только руководители сообщества (доступно при запросе с передачей access_token от имени администратора сообщества)
 * 
 * - search - поиск среди участников 
 * 
 * - count - количество участников, которое нужно вернуть (по умолчанию - 1000)
 * 
 * - offset - смещение, необходимое для выборки определенного подмножества участников
 * 
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function getMembers ({ union_id, sort, filter, search, count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.getMembers`, {
      params: {
        union_id, 
        sort, 
        filter, 
        search,
        count, 
        offset, 
        fields: getValuesAsString(fields)
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getMembers`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает информацию о том, является ли пользователь участником сообщества.
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества
 * - user_ids - идентификаторы пользователей через запятую
 * 
 * Возвращает 1 в случае, если пользователь с идентификатором user_id 
 * является участником сообщества с идентификатором community_id, иначе 0. 
 * 
 */
export async function isMember ({ union_id, user_ids }) {

  try {
    const response = await new HTTP().get(`${entries}.isMember`, {
      params: {
        union_id, 
        user_ids: getValuesAsString(user_ids)
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`isMember`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Данный метод позволяет вступить в объединение.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор
 * 
 * В случае успеха возвращается:
 * 
 * - response = 1
 * 
 */
export async function join ({ union_id }) {
  try {
    const response = await new HTTP().post(`${entries}.join`,
      getFormDataObj({
        union_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`join`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Данный метод позволяет покинуть объединение
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор
 * 
 * В случае успеха возвращается:
 * 
 * - response = 1
 * 
 */
export async function leave ({ union_id }) {
  try {
    const response = await new HTTP().post(`${entries}.leave`,
      getFormDataObj({
        union_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`leave`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Исключает пользователя из объединения
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - сообщество
 * - user_id - пользователь
 */
export async function removeMember ({ union_id, user_id }) {
  try {
    const response = await new HTTP().post(`${entries}.removeMember`,
      getFormDataObj({
        union_id,
        user_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`removeMember`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- АДМИНИСТРИРОВАНИЕ -------------------------------------------------- */
/**
 * Позволяет установить фотографию сообщества.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - **union_id** - идентификатор сообщества
 * - **base64_file** - фото в формате base64
 * 
 */
export async function setPhoto ({ union_id, hash }) {

  try {

    const response = await new HTTP().post(`${entries}.setPhoto`, 
      getFormDataObj({
        union_id,
        hash
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`setPhoto`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет удалить фотографию сообщества.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества
 * 
 */
export async function deletePhoto ({ union_id }) {

  try {

    const response = await new HTTP().post(`${entries}.deletePhoto`, 
      getFormDataObj({
        union_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deletePhoto`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет установить обложку сообщества.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - **union_id** - идентификатор сообщества
 * - **base64_file** - фото в формате base64
 * 
 */
export async function setPhotoCover ({ union_id, base64_file }) {

  try {

    const response = await new HTTP().post(`${entries}.setPhotoCover`, 
      getFormDataObj({
        union_id,
        base64_file
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`setPhotoCover`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет удалить обложку сообщества.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества
 * 
 */
export async function deletePhotoCover ({ union_id }) {

  try {

    const response = await new HTTP().post(`${entries}.deletePhotoCover`, 
      getFormDataObj({
        union_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deletePhotoCover`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет назначить/разжаловать руководителя в сообществе или изменить уровень его полномочий.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - сообщество
 * - user_id - пользователь
 * - role (administrator, editor, moderator, member)
 * 
 */
export async function editManager ({ union_id, user_id, role }) {

  try {

    const response = await new HTTP().post(`${entries}.editManager`, 
      getFormDataObj({
        union_id,
        user_id,
        role
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editManager`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- КОНТАКТЫ -------------------------------------------------- */
/**
 * Получает контакты сообщества
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - q - поисковый запрос (не обязательно)
 */
export async function getContacts ({ union_id, q }) {

  try {
    const response = await new HTTP().get(`${entries}.getContacts`, {
      params: {
        union_id, 
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getContacts`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет создать контакт сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - owner_id - id пользователя
 * - contact_id - id редактируемого контакта
 * 
 * - position - должность
 * - phone - телефон
 * - email - почта
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 */
export async function addContact ({ union_id, owner_id, contact_id, position, phone, email }) {
  try {
    const response = await new HTTP().post(`${entries}.addContact`,
      getFormDataObj({
        union_id,
        owner_id,
        contact_id,
        position,
        phone,
        email
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`addContact`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет редактировать контакт сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - contact_id - id редактируемого контакта
 * 
 * - position - должность
 * - phone - телефон
 * - email - почта
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 */
export async function editContact ({ union_id, contact_id, position, phone, email }) {
  try {
    const response = await new HTTP().post(`${entries}.editContact`,
      getFormDataObj({
        union_id,
        contact_id,
        position,
        phone,
        email
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editContact`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет удалить контакт сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - contact_id - id удаляемого контакта (обязательный параметр)
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 */
export async function deleteContact ({ union_id, contact_id }) {
  try {
    const response = await new HTTP().post(`${entries}.deleteContact`,
      getFormDataObj({
        union_id,
        contact_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deleteContact`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- ССЫЛКИ -------------------------------------------------- */
/**
 * Получает ссылки сообщества
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - q - поисковый запрос (не обязательно)
 */
export async function getLinks ({ union_id, q }) {

  try {
    const response = await new HTTP().get(`${entries}.getLinks`, {
      params: {
        union_id, 
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getLinks`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет добавить ссылку
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - url - ссылка
 * - title - заголовок
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 * 
 */
export async function addLink ({ union_id, url, title }) {
  try {
    const response = await new HTTP().post(`${entries}.addLink`,
      getFormDataObj({
        union_id,
        url,
        title
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`addLink`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет редактировать ссылку сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - link_id - id редактируемой ссылки
 * - title - заголовок
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 * 
 */
export async function editLink ({ union_id, link_id, title }) {
  try {
    const response = await new HTTP().post(`${entries}.editLink`,
      getFormDataObj({
        union_id,
        link_id,
        title
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editLink`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет удалить ссылку сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательный параметр)
 * - link_id - id удаляемой ссылки
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 * 
 */
export async function deleteLink ({ union_id, link_id }) {
  try {
    const response = await new HTTP().post(`${entries}.deleteLink`,
      getFormDataObj({
        union_id,
        link_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deleteLink`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/* ----------------------------------------------- ОРГАНИЗАТОРЫ -------------------------------------------------- */
/**
 * Позволяет получить организаторов сообщества
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - union_id
 * - fields - доп поля
 * 
 */
export async function getSponsors ({ union_id, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.getSponsors`, {
      params: {
        union_id, 
        fields
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getSponsors`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Добавляет организатора сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id
 * - owner_id - организатор
 * - description - описание
 * 
 */
export async function addSponsor ({ union_id, owner_id, description }) {
  try {
    const response = await new HTTP().post(`${entries}.addSponsor`,
      getFormDataObj({
        union_id,
        owner_id,
        description
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`addSponsor`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует организатора сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - sponsor_id
 * - description - описание
 * 
 */
export async function editSponsor ({ sponsor_id, description }) {
  try {
    const response = await new HTTP().post(`${entries}.editSponsor`,
      getFormDataObj({
        sponsor_id,
        description
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editSponsor`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Удаляет организатора сообщества
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - sponsor_id
 * 
 */
export async function deleteSponsor ({ sponsor_id }) {
  try {
    const response = await new HTTP().post(`${entries}.deleteSponsor`,
      getFormDataObj({
        sponsor_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deleteSponsor`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- ПРИГЛАШЕНИЯ -------------------------------------------------- */
/**
 * Позволяет получить приглашения пользователя в объединения
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - type - тип объединения (0, 1, 2)
 * - fields - доп поля
 * - offset
 * - count
 * 
 */
export async function getInvites ({ type, fields, offset, count }) {

  try {
    const response = await new HTTP().get(`${entries}.getInvites`, {
      params: {
        type,
        fields,
        offset,
        count
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getInvites`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет пригласить пользователя в объединение
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор объединения (обязательный параметр)
 * - source_id - id приглашаемого пользователя (обязательный параметр)
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 */
export async function invite ({ union_id, source_id }) {
  try {
    const response = await new HTTP().post(`${entries}.invite`,
      getFormDataObj({
        union_id,
        source_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`invite`, response.data.data);

    return response
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * 
 */
export async function approveInvite ({ union_id, invited_by }) {
  try {
    const response = await new HTTP().post(`${entries}.approveInvite`,
      getFormDataObj({
        union_id,
        invited_by
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`approveInvite`, response.data.data);

    return response
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет отклонить приглашение объединение
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор объединения (обязательный параметр)
 * - invited_by - id кто выслал приглашение (обязательный параметр)
 * 
 * При успешном выполнении:
 * 
 * - response = 1
 */
export async function cancelInvite ({ union_id, invited_by }) {
  try {
    const response = await new HTTP().post(`${entries}.cancelInvite`,
      getFormDataObj({
        union_id,
        invited_by
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`cancelInvite`, response.data.data);

    return response
  } catch (error) {
    throw new Error(error)
  }
}

/* ----------------------------------------------- СООБЩЕСТВА -------------------------------------------------- */
/**
 * Позволяет создать сообщество
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - name - название
 * - description - описание
 * - category_id - категория
 * 
 */
export async function createCommunity ({ name, description, category_id }) {

  try {

    const response = await new HTTP().post(`${entries}.createCommunity`, 
      getFormDataObj({
        name,
        description,
        category_id,
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`createCommunity`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет создать музыкальное сообщество
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - name - название
 * - description - описание
 * - category_id - категория
 * - country_id - страна
 * - city_id - город
 * - main_genre_ids - основные жанры
 * - add_genre_ids - доп жанры
 * 
 */
export async function createCommunityMusic ({ name, description, category_id, country_id, city_id, main_genre_ids, add_genre_ids }) {

  try {

    const response = await new HTTP().post(`${entries}.createCommunityMusic`, 
      getFormDataObj({
        name,
        description,
        category_id,
        country_id,
        city_id,
        main_genre_ids: getValuesAsString(main_genre_ids),
        add_genre_ids: getValuesAsString(add_genre_ids),
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`createCommunityMusic`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает информацию о заданных сообществах.
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - community_ids - идентификаторы сообществ. Максимальное число идентификаторов — 500
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function communitiesGetById ({ community_ids, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.communitiesGetById`, {
      params: {
        community_ids: getValuesAsString(community_ids),
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`communitiesGetById`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает сообщества выбранные редакцией
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - count - количество сообществ, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function communitiesSelRedaction ({ count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.communitiesSelRedaction`, {
      params: {
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`communitiesSelRedaction`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает верифицированных артистов
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - count - количество сообществ, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function getVerifiedArtists ({ count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.getVerifiedArtists`, {
      params: {
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getVerifiedArtists`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает популярные и новые сообщества указанной тематики
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - sphere_id - сфера сообществ
 * - category_id - категория сообщества
 * - only_verified - только проверенные
 * - count - количество сообществ, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function communitiesListRecommendations ({ sphere_id, only_verified, category_id, count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.communitiesListRecommendations`, {
      params: {
        sphere_id,
        only_verified,
        category_id,
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`communitiesListRecommendations`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает категории мест
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - kind - (-1 - все, 0 - обычные, 1 - музыкальные, 2 - медиа)
 * - sphere_id - id сферы (не обязательно)
 * 
 */
export async function getCategoriesCommunities ({ kind, sphere_id }) {

  try {
    const response = await new HTTP().get(`${entries}.getCategoriesCommunities`, {
      params: {
        kind,
        sphere_id
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getCategoriesCommunities`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует основную информацию о сообществе
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - id места
 * - name - название
 * - description - описание
 * - access - доступ (0 - открытое, 1 - закрытое, 2 - частное)
 * - category_id - категория
 * - website - сайт
 * - age_limits - возрастное ограничение (0, 6, 12, 16, 18)
 * 
 */
export async function editCommunity ({ union_id, name, description, access, category_id, website, age_limits, city_id, country_id }) {

  try {

    const response = await new HTTP().post(`${entries}.editCommunity`, 
      getFormDataObj({
        union_id,
        name,
        description,
        access,
        category_id,
        website,
        age_limits,
        city_id,
        country_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editCommunity`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}




/* ----------------------------------------------- МЕСТА -------------------------------------------------- */
/**
 * Позволяет создать место
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - is_representative - (1 - пользователь представитель места, 0 - нет)
 * - name - название
 * - description - описание
 * - category_id - категория
 * - phones - массив телефонов
 * - working_hours - часы работы
 * - country_id 
 * - city_id
 * - location - местоположение (пример: Россия, Москва, Ленинградский проспект, д.6)
 * - location_obj - объект местоположения
 * - geolocation - координаты местоположения
 * - photo_base64 - аватар в base64 формате
 * 
 * Не обязательные:
 * 
 * - website
 * - contact_phone 
 * - contact_email
 * - contact_position
 * 
 */
export async function createPlace ({ is_representative, name, description, category_id, phones, working_hours, country_id, city_id, location, location_obj, geolocation, website, contact_phone, contact_email, contact_position }) {

  try {

    const response = await new HTTP().post(`${entries}.createPlace`, 
      getFormDataObj({
        is_representative,
        name,
        description,
        category_id,
        phones,
        working_hours,
        country_id,
        city_id,
        location,
        location_obj,
        geolocation: getValuesAsString(geolocation),

        website,
        contact_phone ,
        contact_email,
        contact_position
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`createPlace`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает информацию о заданных местах.
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - place_ids - идентификаторы сообществ. Максимальное число идентификаторов — 500
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function placesGetById ({ place_ids, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.placesGetById`, {
      params: {
        place_ids: getValuesAsString(place_ids),
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`placesGetById`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует основную информацию о месте
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - id места
 * - name - название
 * - description - описание
 * - category_id - категория
 * - website - сайт
 * - age_limits - возрастное ограничение (0, 6, 12, 16, 18)
 * - location - местоположение
 * - phone - телефон
 * 
 */
export async function editPlace ({ union_id, name, description, category_id, website, age_limits, location, location_obj, geolocation, phones }) {

  try {

    const response = await new HTTP().post(`${entries}.editPlace`, 
      getFormDataObj({
        union_id,
        name,
        description,
        category_id,
        website,
        age_limits,
        location,
        location_obj,
        geolocation: getValuesAsString(geolocation),
        phones
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editPlace`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует информацию о представителе места
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - id места
 * - contact_phone - телефон
 * - contact_email - почта
 * - contact_position - должность
 * 
 */
export async function editPlaceContactUser ({ union_id, contact_phone, contact_email, contact_position }) {

  try {

    const response = await new HTTP().post(`${entries}.editPlaceContactUser`, 
      getFormDataObj({
        union_id,
        contact_phone,
        contact_email,
        contact_position
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editPlaceContactUser`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует информацию о сервисах места
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательно)
 * - wifi - Наличие бесплатного Wi-Fi
 * - card - Безналичный расчет
 * - cash - Наличный расчёт
 * 
 * В случае успеха возвращается:
 * 
 * - response = 1
 * 
 */
export async function editPlaceFeatures ({ union_id, wifi, card, cash }) {

  try {

    const response = await new HTTP().post(`${entries}.editPlaceFeatures`, 
      getFormDataObj({
        union_id,
        wifi,
        card,
        cash
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editPlaceFeatures`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует информацию о сервисах места
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщества (обязательно)
 * - working_hours - время работы
 * 
 * В случае успеха возвращается:
 * 
 * - response = 1
 */
export async function editPlacesWorkingHours ({ union_id, working_hours }) {

  try {

    const response = await new HTTP().post(`${entries}.editPlacesWorkingHours`, 
      getFormDataObj({
        union_id,
        working_hours,
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editPlacesWorkingHours`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает места выбранные редакцией
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - city_id - id города
 * - count - количество сообществ, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function placesSelRedaction ({ city_id, count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.placesSelRedaction`, {
      params: {
        city_id,
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`placesSelRedaction`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает популярные и новые места указанной тематики
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - city_id - id города
 * - category_id - категория сообщества
 * - sphere_id - сфера сообществ
 * - only_verified - только проверенные
 * - count - количество сообществ, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function placesListRecommendations ({ city_id, sphere_id, category_id, only_verified, count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.placesListRecommendations`, {
      params: {
        city_id,
        sphere_id,
        category_id,
        only_verified,
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`placesListRecommendations`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает категории мест
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - sphere_id
 * 
 */
export async function getCategoriesPlaces (sphere_id) {

  try {
    const response = await new HTTP().get(`${entries}.getCategoriesPlaces`, {
      params: {
        sphere_id
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getCategoriesPlaces`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}




/* ----------------------------------------------- СОБЫТИЯ -------------------------------------------------- */
/**
 * Возвращает информацию о заданных событиях
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - event_ids - идентификаторы сообществ. Максимальное число идентификаторов — 500
 * - fields - список дополнительных полей, которые необходимо вернуть (sponsor_id - организатор события)
 * 
 */
export async function eventsGetById ({ event_ids, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.eventsGetById`, {
      params: {
        event_ids: getValuesAsString(event_ids),
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`eventsGetById`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает категории событий
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - sphere_id - id сферы (не обязательно)
 * 
 */
export async function getCategoriesEvents ({ sphere_id }) {

  try {
    const response = await new HTTP().get(`${entries}.getCategoriesEvents`, {
      params: {
        sphere_id
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getCategoriesEvents`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает события выбранные редакцией
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - city_id - id города
 * - count - количество сообществ, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function eventsSelRedaction ({ city_id, count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.eventsSelRedaction`, {
      params: {
        city_id,
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`eventsSelRedaction`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает популярные и новые события указанной тематики
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - city_id - id города
 * - sphere_id - сфера
 * - category_id - категория
 * - only_verified - только проверенные
 * - count - количество, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function eventsListRecommendations ({ city_id, sphere_id, category_id, only_verified, count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.eventsListRecommendations`, {
      params: {
        city_id,
        sphere_id,
        category_id,
        only_verified,
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`eventsListRecommendations`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Возвращает события за указанный период времени
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - city_id - id города
 * 
 * Не обязательные:
 * 
 * - start_time - время начала (по умолчанию - текущий день)
 * - end_time - время окончания (по умолчанию - бесконечно)
 * - sphere_id - сфера
 * - category_id - категория
 * - only_verified - только проверенные
 * - count - количество, которое нужно вернуть
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * 
 */
export async function eventsFeed ({ city_id, start_time, end_time, sphere_id, category_id, only_verified, count, offset, fields }) {

  try {
    const response = await new HTTP().get(`${entries}.eventsFeed`, {
      params: {
        city_id,
        start_time,
        end_time,
        sphere_id,
        category_id,
        only_verified,
        count,
        offset,
        fields: getValuesAsString(fields)
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`eventsFeed`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет создать событие
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - owner_id - id пользователя или объединения являющимся организатором (поддерживается только объединение)
 * - name - название
 * - description - описание
 * - category_id - категория
 * - photo_base64 - аватар в base64 формате
 * 
 * Не обязательные:
 * 
 * - time_start
 * - time_end
 * - country_id 
 * - city_id
 * 
 */
export async function createEvent ({ owner_id, name, description, category_id, photo_base64, time_start, time_end, country_id, city_id }) {

  try {

    const response = await new HTTP().post(`${entries}.createEvent`, 
      getFormDataObj({
        owner_id,
        name,
        description,
        category_id,
        photo_base64,
        time_start,
        time_end,
        country_id,
        city_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`createEvent`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует основную информацию о событии
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - union_id - id события
 * - name - название
 * - description - описание
 * - category_id - категория
 * - time_start
 * - time_end
 * - country_id
 * - city_id
 * 
 */
export async function editEvent ({ union_id, name, description, category_id, time_start, time_end, country_id, city_id }) {

  try {

    const response = await new HTTP().post(`${entries}.editEvent`, 
      getFormDataObj({
        union_id,
        name,
        description,
        category_id,
        time_start,
        time_end,
        country_id,
        city_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editEvent`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает события сообщетсва
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - union_id - идентификатор сообщетсва
 * - search - поиск по названию 
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - fields - список дополнительных полей, которые необходимо вернуть
 * - count - количество событий
 * 
 */
export async function getEvents ({ union_id, search, offset, fields, count }) {

  try {
    const response = await new HTTP().get(`${entries}.getEvents`, {
      params: {
        union_id,
        search,
        offset,
        fields: getValuesAsString(fields),
        count
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`getEvents`, response.data.data);

    return response.data.data  
  } catch (error) {
    throw new Error(error)
  }
}