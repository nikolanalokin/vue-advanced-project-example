import HTTP from '../http'
import { getValuesAsString, getFormDataObj } from '../../utils'
import debug from 'debug'

const entries = 'users'
const logger = debug(`api:${entries}`)

/**
 * Возвращает информацию о пользователе
 * 
 * Принимаемые параметры:
 * 
 * user_ids - id пользователей через запятую
 * fields, которые может содержать следующие параметры:
 * - last_visit - время последнего посещения
 * - status - статус пользователя
 * - sex - пол пользователя
 * - photo - массив содержащий фото пользователя разных размеров
 * - marital_status - семейное положение
 * - birthday - массив содержащий информацию о дате рождения
 * - birthday_privacy - приватность дня рождения (только для текущего пользователя)
 * - city город
 * ~~ id 
 * ~~ name 
 * - country страны
 * ~~ id 
 * ~~- name 
 * - country_city_name - текстовое представление города и страны через запятую
 * - relatives - массив, описывающий родственные отношения
 * - contacts - массив, описывающий контакты пользователя
 * - interests - массив, описывающий интересы пользователя
 * - education - массив, описывающий образование пользователя
 * - higher_education - массив, описывающий высшее образование пользователя
 * - career - массив, описывающий карьеру пользователя
 * - military - массив, описывающий военную службу пользователя
 * - position - массив, описывающий жизненную позицию пользователя
 * - counters - массив счетчиков пользователя
 * 
 * - system_info - текстовые значения select полей
 * 
 * В ответе возвращается объект состоящий из массивов пользователей, содержащий:
 * - id - id пользователя
 * - first_name
 * - last_name
 * - deactivated - (deleted, blocked) в случае, если пользователь удален или заблокирован
 * - online
 * - запрошенные поля в fields
 * 
 */
export async function get ({ user_ids, fields = '', system_info = 0 }) {

  try {

    let response = await new HTTP().get(`${entries}.get`, {
      params: {
        user_ids: getValuesAsString(user_ids),
        fields: getValuesAsString(fields),
        system_info
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`get`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Глобальный поиск по пользователям
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - search - поисковый запрос (обязательный параметр)
 * - sex - пол
 * - with_photo - обязательно с фото
 * - country_id - id страны
 * - city_id - id города
 * - offset - смещение, необходимое для выборки определенного подмножества
 * - count - количество которое нужно вернуть
 * 
 */
export async function search ({ search, sex, with_photo, country_id, city_id, offset, count }) {

  try {

    let response = await new HTTP().get(`${entries}.search`, {
      params: {
        search,
        sex,
        with_photo,
        country_id,
        city_id,
        offset,
        count
      }
    })

    if (process.env.NODE_ENV == 'development') logger(`search`, response.data.data);

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Позволяет установить фотографию пользователя.
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - **base64_file** - фото в формате base64
 * 
 */
export async function setPhoto ({ hash }) {

  try {
    const response = await new HTTP().post(`${entries}.setPhoto`, 
      getFormDataObj({
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
 * - нет
 * 
 */
export async function deletePhoto () {

  try {
    const response = await new HTTP().post(`${entries}.deletePhoto`)

    if (process.env.NODE_ENV == 'development') logger(`deletePhoto`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование раздела "Основное"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - first_name
 * - last_name
 * - sex		       - Пол (1 - муж, 2 - жен)
 * - martial 		   - Семейное положение
 * - martial_id 	 - id партнера
 * - bdate			   - День рождения (Пример: 18.03.1996)
 * - bdate_privacy - (1 - показывать все, 2 - только месяц и дата, 3 - не показывать)
 * - city_id			 - id города,
 * - status		     - статус пользователя (есть отдельный метод)
 * 
 */
export async function edit ({ first_name, last_name, sex, martial, martial_id, bdate, bdate_privacy, city_id, status }) {

  try {
    const response = await new HTTP().post(`${entries}.edit`, 
      getFormDataObj({
        first_name,
        last_name,
        sex,
        martial,
        martial_id,
        bdate,
        bdate_privacy,
        city_id,
        status
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`edit`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование раздела "Контакты"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - city_id
 * - phone
 * - phone_privacy
 * - phone2
 * - phone2_privacy
 * - skype
 * - skype_privacy
 * - site
 * 
 */
export async function editContacts ({ city_id, phone, phone_privacy, phone2, phone2_privacy, skype, skype_privacy, site }) {

  try {
    const response = await new HTTP().post(`${entries}.editContacts`, 
      getFormDataObj({
        city_id, phone, phone_privacy, phone2, phone2_privacy, skype, skype_privacy, site
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editContacts`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование раздела "Интересы"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - activities
 * - interests
 * - music
 * - films
 * - tv
 * - books
 * - citations
 * - about
 * 
 */
export async function editInterests ({ activities, interests, music, films, tv, books, citations, about }) {

  try {
    const response = await new HTTP().post(`${entries}.editInterests`, 
      getFormDataObj({
        activities, interests, music, films, tv, books, citations, about
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editInterests`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование раздела "Жизненная позиция"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - political
 * - religion
 * - life
 * - people
 * - smoking
 * - alcohol
 * - inspired_by
 * 
 */
export async function editPosition ({ political, religion, life, people, smoking, alcohol, inspired_by }) {

  try {
    const response = await new HTTP().post(`${entries}.editPosition`, 
      getFormDataObj({
        political, religion, life, people, smoking, alcohol, inspired_by
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editPosition`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование раздела "Родственники"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - parent_ids      - Родители
 * - grandparent_ids - Дедушки, бабушки
 * - sibling_ids     - Братья, сестры
 * - child_ids       - Дети
 * - grandchild_ids  - Внуки
 * 
 */
export async function editRelatives ({ parent_ids, grandparent_ids, sibling_ids, child_ids, grandchild_ids }) {

  try {
    const response = await new HTTP().post(`${entries}.editRelatives`, 
      getFormDataObj({
        parent_ids: getValuesAsString(parent_ids),
        grandparent_ids: getValuesAsString(grandparent_ids),
        sibling_ids: getValuesAsString(sibling_ids),
        child_ids: getValuesAsString(child_ids),
        grandchild_ids: getValuesAsString(grandchild_ids),
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editRelatives`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование раздела "Военная служба"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - country_id  - id страны
 * - military_id - id войковской части
 * - year_start  - Год начала службы
 * - year_finish - Год окончания службы
 * 
 * - id          - идентификатор редактируемой записи (если 0 или не передается - то создается новая запись)
 * 
 */
export async function editMilitary ({ country_id, military_id, year_start, year_finish, id }) {

  try {
    const response = await new HTTP().post(`${entries}.editMilitary`, 
      getFormDataObj({
        country_id, military_id, year_start, year_finish, id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editMilitary`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Удаление записи из раздела "Военная служба"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - id - идентификатор удаляемой записи
 * 
 */
export async function deleteMilitary ({ id }) {

  try {
    const response = await new HTTP().post(`${entries}.deleteMilitary`, 
      getFormDataObj({
        id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deleteMilitary`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирование раздела "Карьера"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - community_id - Сообщество
 * - country_id   - id страны
 * - city_id      - id города
 * - year_start   - Год начала службы
 * - year_finish  - Год окончания службы
 * - position     - Должность
 * 
 * - id - идентификатор редактируемой записи (если 0 или не передается - то создается новая запись)
 * 
 */
export async function editCareer ({ union_id, country_id, city_id, year_start, year_finish, position, id }) {

  try {
    const response = await new HTTP().post(`${entries}.editCareer`, 
      getFormDataObj({
        union_id, country_id, city_id, year_start, year_finish, position, id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editCareer`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Удаление записи из раздела "Карьера"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - id - id удаляемой записи
 * 
 */
export async function deleteCareer ({ id }) {

  try {
    const response = await new HTTP().post(`${entries}.deleteCareer`, 
      getFormDataObj({
        id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deleteCareer`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
// editEducation
/**
 * Удаление записи из раздела "Среднее образование"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - id - id удаляемой записи
 * 
 */
export async function deleteEducation ({ id }) {

  try {
    const response = await new HTTP().post(`${entries}.deleteEducation`, 
      getFormDataObj({
        id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deleteEducation`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
// editHigherEducation
/**
 * Удаление записи из раздела "Высшее образование"
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - id - id удаляемой записи
 * 
 */
export async function deleteHigherEducation ({ id }) {

  try {
    const response = await new HTTP().post(`${entries}.deleteHigherEducation`, 
      getFormDataObj({
        id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`deleteHigherEducation`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}