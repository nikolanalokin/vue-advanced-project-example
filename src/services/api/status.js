import HTTP from '../http'
import { getValuesAsString, getFormDataObj } from '../../utils'
import debug from 'debug'

const entries = 'status'
const logger = debug(`api:${entries}`)

/**
 * Получает текст статуса пользователя или сообщества.
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - user_id - идентификатор пользователя, статус которого необходимо получить
 * - union_id - идентификатор сообщества, статус которого необходимо получить
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - text - текст статуса пользователя или сообщества
 * 
 */
export async function get ({ user_id, union_id }) {

  try {
    const response = await new HTTP().get(`${entries}.get`, {
      params: {
        user_id,
        union_id
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`get`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}
/**
 * Устанавливает новый статус текущему пользователю или сообществу.
 * 
 * Метод: POST, требуется авторизация
 * 
 * Принимаемые параметры:
 * 
 * - text - текст нового статуса.
 * - union_id - идентификатор сообщества, в котором будет установлен статус
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - response = 1
 * 
 */
export async function set ({ text, union_id }) {

  if (text == undefined) return false

  try {
    const response = await new HTTP().post(`${entries}.set`, 
      getFormDataObj({
        text,
        union_id
      })
    )

    if (process.env.NODE_ENV == 'development') logger(`set`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}