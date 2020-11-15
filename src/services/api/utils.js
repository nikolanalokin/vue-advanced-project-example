import HTTP from '../http'
import { getValuesAsString, getFormDataObj } from '../../utils'
import debug from 'debug'

const entries = 'utils'
const logger = debug(`api:${entries}`)

/**
 * 
 * Определяет тип объекта (пользователь, сообщество) и его идентификатор по короткому имени screen_name.
 * 
 * - screen_name - короткое имя пользователя, группы
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - object_id - идентификатор объекта
 * - type - тип объекта (user, place, event, community)
 * 
 * Если короткое имя screen_name не занято, то будет возвращён пустой объект
 * 
 */
export async function resolveScreenName ({ screen_name, fields }) {
  try {
    const response = await new HTTP({ v: '2.0' }).get(`${entries}.resolveScreenName`, {
      params: {
        screen_name,
        fields: getValuesAsString(fields)
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`resolveScreenName`, response.data.data)

    return response.data.data
  } catch (error) {
    throw error
  }
}
/**
 * Возвращает информацию о том, является ли внешняя ссылка заблокированной на сайте
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - url - внешняя ссылка (полный путь c http)
 * 
 * В ответе возвращается объект с полями:
 * 
 * - is_banned - (1 - заблокировано, 0 - нет)
 * - description - причина блокировки
 * 
 */
export async function checkLink ({ url }) {
  try {
    const response = await new HTTP().get(`${entries}.checkLink`, {
      params: {
        url
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`checkLink`, response.data.data)

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Проверяет короткий адрес страницы на корректность и занятость
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - screen_name - проверяемый адрес страницы
 * 
 * В ответе возвращается объект с полями:
 * 
 * - -1 - адрес занят
 * -  0 - адрес некорректен
 * -  1 - адрес корректен и свободен
 * 
 */
export async function checkScreenName ({ screen_name }) {
  try {
    const response = await new HTTP().get(`${entries}.checkScreenName`, {
      params: {
        screen_name
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`checkScreenName`, response.data.data)

    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Редактирует короткий адрес страницы пользователя или объединения
 * 
 * Метод: POST
 * 
 * Принимаемые параметры:
 * 
 * - owner_id - пользователь или объединение
 * - screen_name - новый адрес страницы
 * 
 * В ответе возвращается объект с полями:
 * 
 * - 0 - адрес некорректен
 * - -1 - адрес занят
 * - 1 - адрес изменен
 * 
 */
export async function editScreenName ({ owner_id, screen_name }) {
  try {
    const response = await new HTTP().post(`${entries}.editScreenName`, 
      getFormDataObj({
        owner_id,
        screen_name
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`editScreenName`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Генерирует QR code по строке
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - text - текст сообщения
 * - format - png, jpg, svg, eps (по умолчанию: png)
 * - level - H, M, Q, L (по умолчанию: H)
 * - size - размер (по умолчанию: 24)
 * - margin - отступы (по умолчанию: 1)
 * 
 * В ответе возвращается ссылка на изображение
 * 
 */
export async function getQRCode ({ text, format, level, size, margin }) {
  try {
    const response = await new HTTP({ v: '2.0' }).get(`${entries}.getQRCode`, {
      params: {
        text,
        format,
        level,
        size,
        margin
      }
    })
    if (process.env.NODE_ENV == 'development') logger(`getQRCode response`, response.data)
    return response.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`getQRCode error:`, error.response)
    throw error.response
  }
}
/**
 * Возвращает информация о банке и платежной системе по номеру карты
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - number - номер карты
 * 
 * Результат:
 * 
 * - name - наименование банка
 * - logo - логотип банка
 * - color - основной цвет банка
 * - type - тип платежной системы
 * - type_logo - логотип платежной системы 
 * 
 * ** Возвращаются только те поля, которые удалось определить **
 */
export async function getBankInfo ({ number }) {
  try {
    const response = await new HTTP({ v: '2.0' }).get(`${entries}.getBankInfo`, {
      params: {
        number
      }
    })
    if (process.env.NODE_ENV == 'development') logger(`getBankInfo response`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`getBankInfo error:`, error.response)
    throw error.response
  }
}