import HTTP from '../http'
import { getFormDataObj } from '../../utils'
import debug from 'debug'

const entries = 'auth'
const logger = debug(`api:${entries}`)

/**
 * # Первый этап авторизации (get):
 * 
 * Принимаемые значения:
 * 
 * - **redirect_uri**     
 * Передать в поле: 'default'
 * 
 * - **display**          
 * Передать в поле: 'none'
 * 
 * - **scope**            
 * Передать в поле: 1
 * 
 * - **client_secret**
 * Передать в поле: 'secretQuery'
 * 
 * - **login**
 * - **password**
 * 
 * Возвращаемое значение:
 * - **redirect_uri**
 * - **code**
 * 
 * # Второй этап авторизации (token):
 * - **client_secret**
 * Передать в поле: 'secretQuery'
 * 
 * - **redirect_uri**      получено первым методом
 * - **code**              получено первым методом
 * 
 * При успешном выполнении возвращаются поля:
 * 
 * - **user_id** - id пользователя
 * - **access_token** - токен пользователя (для доступа к другим методам API)
 * - **refresh_token**
 * - **expires_in** - время истечения срока годности access_token
 * - **reg_time** - время авторизации
 */
export async function logIn ({ login, password }) {
  try {
    let response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.get`,
      getFormDataObj({
        redirect_uri: 'default',
        display: 'none',
        scope: '1',
        client_secret: 'secretQuery',
        login, 
        password
      })
    )
    let { code, redirect_uri } = response.data.data
    try {
      response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.token`,
        getFormDataObj({
          client_secret: 'secretQuery',
          redirect_uri,
          code, 
        })
      )
      if (process.env.NODE_ENV == 'development') logger(`logIn response:`, response.data.data)
      return response.data.data
    } catch (error) {
      throw error
    }
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`logIn error:`, error.response.data)
    throw error.response.data
  }
}

/**
 * Метод удаляет access_token и связанные с ним push_token и device_token.
 * 
 * Необходимо вызывать при выходе из аккаунта или при завершении сеансов с других устройств.
 * 
 * Метод POST.
 * 
 * 
 * **Обязательные поля**
 * 
 * - нет (будет удален текущий access_token пользователя)
 * 
 * 
 * **Необязательные поля**
 * 
 * - access_token - токен, который необходимо удалить
 * - token_id - id токена, который необходимо удалить
 * 
 * **Результат**
 * 
 * response = 1
 * 
 * ** Коды ошибок **
 * 
 * - 9 - Access denied
 */
export async function remove ({ access_token, token_id }) {
  try {
    const response = await new HTTP({ v: '2.0' }).post(`${entries}.remove`, 
      getFormDataObj({
        access_token,
        token_id
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`remove response:`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`remove error:`, error.response.data)
    throw error
  }
}
/**
 * Метод удаляет все access_token кроме текущего.
 * 
 * Метод POST.
 * 
 * **Обязательные поля**
 * 
 * - нет
 * 
 * 
 * **Необязательные поля**
 * 
 * - нет
 * 
 * **Результат**
 * 
 * response = 1
 * 
 * ** Коды ошибок **
 * 
 * - нет
 */
export async function removeAll () {
  try {
    const response = await new HTTP({ v: '2.0' }).post(`${entries}.removeAll`)
    if (process.env.NODE_ENV == 'development') logger(`removeAll response:`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`removeAll error:`, error.response.data)
    throw error
  }
}
/**
 * Метод обновления access_token
 * 
 * Метод POST.
 * 
 * **Обязательные поля**
 * 
 * - refresh_token
 * 
 * **Необязательные поля**
 * 
 * - нет
 * 
 * **Результат**
 * 
 * - response = 1
 * - user_id
 * - access_token
 * - refresh_token
 * 
 * ** Коды ошибок **
 * 
 * - 12 - Invalid field
 */
export async function refresh ({ refresh_token }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.refresh`,
      getFormDataObj({
        refresh_token
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`refresh response:`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`refresh error:`, error.response.data)
    throw error
  }
}
/**
 * Метод начинает регистрацию нового пользователя
 * 
 * Метод GET.
 * 
 * **Обязательные поля**
 * 
 * - first_name - имя
 * - last_name - фамилия
 * - country - id страны
 * - city - id города
 * - sex - (1 - муж, 2 -жен)
 * - phone - моб телефон
 * - password - пароль
 * 
 * **Необязательные поля**
 * 
 * - referrer_id - id пригласившего пользователя
 * - is_develop - (если равен 1, то смс сообщение не отправляется. код можно найти в беседе LO | Logs)
 * 
 * **Результат**
 * 
 * - Если все данные корректны, то на указанный номер придет смс-сообщение. 
 * 
 * - *Для подтверждения регистрации необходимо воспользоваться методом auth.signupConfirm*
 * 
 * **Коды ошибок**
 * 
 * - 20 - Mobile code service disabled (отправка отключена со стороны нашего api)
 * - 21 - Mobile code service error (ошибка на сервисе смс сообщений)
 * - 100 - Invalid first name
 * - 101 - Invalid last name
 * - 102 - Invalid country
 * - 103 - Invalid city
 * - 104 - Invalid sex
 * - 105 - Invalid password
 * - 106 - Invalid phone
 * - 107 - This phone number already exists
 * - 108 - This code is invalid
 * 
 */
export async function signup ({ first_name, last_name, country, city, sex, phone, password, referrer_id, is_develop }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.signup`,
      getFormDataObj({
        first_name,
        last_name,
        country,
        city,
        sex,
        phone,
        password,
        referrer_id,
        is_develop
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`signup response:`, response.data)
    return response.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`signup error:`, error.response.data)
    throw error.response.data
  }
}
/**
 * Завершает регистрацию пользователя, начатую методом auth.signup.
 * 
 * Метод GET.
 * 
 * **Принимаемые параметры:**
 * 
 * - phone     // номер телефона
 * - code      // код из смс-сообщения
 * 
 * **При успешном выполнении возвращаются поля:**
 * 
 * - user_id - id пользователя
 * - access_token - токен пользователя (для доступа к другим методам API)
 * - refresh_token
 * 
 */
export async function signupConfirm ({ phone, code }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.signupConfirm`,
      getFormDataObj({
        phone,
        code
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`signupConfirm response:`, response.data)
    return response.data  
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`signupConfirm error:`, error.response.data)
    throw error.response.data
  }
}
/**
 * Отправка нового кода потдверждения
 * 
 * Метод GET.
 * 
 * **Обязательные поля**
 * 
 * - phone - моб телефон
 * 
 * **Необязательные поля**
 * 
 * - is_develop - (если равен 1, то смс сообщение не отправляется. код можно найти в беседе LO | Logs)
 * 
 * **Результат**
 * 
 * - Если все данные корректны, то на указанный номер придет смс-сообщение с кодом. 
 * 
 * **Коды ошибок**
 * 
 * - 20 - Mobile code service disabled (отправка отключена со стороны нашего api)
 * - 21 - Mobile code service error (ошибка на сервисе смс сообщений)
 * - 24 - Mobile code many requests
 * - 106 - Invalid phone
 * 
 */
export async function resendCode ({ phone, is_develop }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.resendCode`,
      getFormDataObj({
        phone,
        is_develop
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`resendCode response:`, response.data)
    return response.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`resendCode error:`, error.response.data)
    throw error.response.data
  }
}
/**
 * Метод для смены пароля со страницы регистрации (если имеется доступ к телефону).
 * 
 * 1 шаг.
 * Проверить наличие пользователя в БД передав поля: phone, first_name, last_name.
 * 
 * 2 шаг.
 * Вывести информацию о пользователе (полученную на 1 шаге), снова обратиться к этому же методу передав дополнительно поля: send_code = 1, password - новый пароль.
 * 
 * 3 шаг.
 * Если на 2 шаге все корректно, то на номер телефона будет отправлен код подтверждения для смены пароля. Переход к методу auth.newPasswordConfirm
 * 
 * 
 * Метод POST.
 * 
 * 
 * **Обязательные поля**
 * 
 * - phone - мобильный телефон принадлежащий странице пользователя
 * - first_name - имя пользователя
 * - last_name - фамилия пользователя
 * 
 * **Необязательные поля**
 * 
 * - send_code - необходимость выслать код подтверждения
 * - password - новый пароль
 * - fields - дополнительные поля (для информации о пользователе)
 * - is_develop - (если равен 1, то смс сообщение не отправляется. код можно найти в беседе LO | Logs)
 * 
 * **Результат**
 * 
 * - Если пользователь с указанным номером телефона, именем и фамилией найден в базе - возвращается response = 1 и поле user - с информацией о пользователе.
 * 
 * **Коды ошибок**
 * 
 * - 20 - Mobile code service disabled (отправка отключена со стороны нашего api)
 * - 21 - Mobile code service error (ошибка на сервисе смс сообщений)
 * - 105 - Invalid password
 * - 106 - Invalid phone
 * - 401 - User not found
 * - 402 - User not found by phone (нет пользователя с таким номером телефона)
 * - 403 - User not found by name (имя не совпадает с телефоном)
 */
export async function newPassword ({ phone, first_name, last_name, send_code, password, fields, is_develop }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.newPassword`,
      getFormDataObj({
        phone,
        first_name,
        last_name,
        send_code,
        password,
        fields,
        is_develop
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`newPassword response:`, response.data.data)
    return response.data.data  
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`newPassword error:`, error.response.data)
    throw error.response.data
  }
}
/**
 * Завершает смену пароля со страницы регистрации начатую методом auth.newPassword
 * 
 * Метод POST.
 * 
 * 
 * **Обязательные поля**
 * 
 * - phone - мобильный телефон принадлежащий странице пользователя
 * - code - код подтверждения
 * - password - пароль
 * 
 * **Необязательные поля**
 * 
 * - нет
 * 
 * **Результат**
 * 
 * - В случае успеха возвращается response = 1.
 * 
 * **Коды ошибок**
 * 
 * - 22 - Mobile code no data (нет данных о коде-подтверждения)
 * - 23 - Count limit of code attempt (слишком частые обращения)
 * - 105 - Invalid password
 * - 106 - Invalid phone
 * - 108 - This code is invalid (неверный код подтверждения)
 * - 401 - User not found
 * - 402 - User not found by phone (нет пользователя с таким номером телефона)
 * 
 */
export async function newPasswordConfirm ({ phone, code, password }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.newPasswordConfirm`,
      getFormDataObj({
        phone,
        code,
        password
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`newPasswordConfirm response:`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`newPasswordConfirm error:`, error.response.data)
    throw error.response.data
  }
}

/**
 * Метод для восстановление доступа к странице через смену номера телефона.
 * 
 * Метод POST.
 * 
 * 
 * **Обязательные поля**
 * 
 * - user_id - id пользователя
 * - phone - мобильный телефон принадлежащий странице пользователя
 * - phone_new - новый номер телефона
 * - email - почта
 * - password - пароль
 * 
 * **Необязательные поля**
 * 
 * - нет
 * 
 * **Результат**
 * 
 * - response = 1
 * - request_id - id заявки
 * - unique_id - уникальный идентификатор заявки
 * - upload_url - адрес для загрузки фото
 * 
 * =====
 * 
 * На полученный адрес (upload_url) необходимо отправить:
 * - **upload_file** - обычное изображение
 * - **base64_file** - файл base64
 * - **request_id** - id заявки
 * - **unique_id** - уникальный идентификатор заявки
 * 
 * После успешной загрузки изображения будет возвращен **response**, с ним необходимо работать в методе **auth.restoreSavePhoto**
 * 
 * =====
 * 
 * ** Коды ошибок **
 * 
 * - 105 - Invalid password
 * - 106 - Invalid phone
 * - 109 - Invalid phone new
 * - 401 - User not found
 * - 402 - User not found by phone (нет пользователя с таким номером телефона)
 * - 1101 - Incorrect email
 */
export async function restore ({ user_id, phone, phone_new, email, password }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.restore`,
      getFormDataObj({
        user_id,
        phone,
        phone_new,
        email,
        password
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`restore response:`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`restore error:`, error.response.data)
    throw error.response.data
  }
}
/**
 * Сохраняет фото в заявке на восстановление пароля (auth.restore)
 * 
 * Метод: POST
 * 
 * **Обязательные поля**
 * 
 * - hash - строка, полученная после загрузки фото
 * 
 * **Необязательные поля**
 * 
 * - is_develop - (если равен 1, то смс сообщение не отправляется. код можно найти в беседе LO | Logs)
 * 
 * **Результат**
 * 
 * - response = 1
 * 
 * На новый номер телефона придет код-подтверждения, который нужно использовать в методе auth.restoreConfirm
 * 
 * ** Коды ошибок **
 * 
 * - 1 - Unknown Error
 * - 20 - Mobile code service disabled (отправка отключена со стороны нашего api)
 * - 21 - Mobile code service error (ошибка на сервисе смс сообщений)
 * - 111 - Invalid hash
 * - 493 - Photo already loaded
 */
export async function restoreSavePhoto ({ hash, is_develop }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.restoreSavePhoto`,
      getFormDataObj({
        hash,
        is_develop
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`restoreSavePhoto response:`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`restoreSavePhoto error:`, error.response.data)
    throw error.response.data
  }
}
/**
 * Подтверждает заявку на смену пароля со страницы регистрации начатую методом auth.restore
 * 
 * Метод POST.
 * 
 * 
 * **Обязательные поля**
 * 
 * - request_id  - id заявки
 * - unique_id - уникальный идентификатор
 * - code - код подтверждения
 * 
 * **Необязательные поля**
 * 
 * - нет
 * 
 * **Результат**
 * 
 * - В случае успеха возвращается response = 1.
 * 
 * ** Коды ошибок **
 * 
 * - 22 - Mobile code no data (нет данных о коде-подтверждения)
 * - 23 - Count limit of code attempt (слишком частые обращения)
 * - 110 - Invalid request id
 * - 108 - This code is invalid (неверный код подтверждения)
 */
export async function restoreConfirm ({ request_id, unique_id, code }) {
  try {
    const response = await new HTTP({ auth: false, v: '2.0' }).post(`${entries}.restoreConfirm`,
      getFormDataObj({
        request_id,
        unique_id,
        code
      })
    )
    if (process.env.NODE_ENV == 'development') logger(`restoreConfirm response:`, response.data.data)
    return response.data.data
  } catch (error) {
    if (process.env.NODE_ENV == 'development') logger(`restoreConfirm error:`, error.response.data)
    throw error.response.data
  }
}