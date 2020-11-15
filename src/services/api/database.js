import HTTP from '../http'
import { getValuesAsString } from '../../utils'
import debug from 'debug'

const entries = 'database'
const logger = debug(`api:${entries}`)

/**
 * Возвращает список городов
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - need_all - 1 – возвращать все страны. 0 – возвращать только основные страны
 * - offset   - смещение, необходимый для получения определенного подмножества стран
 * - count    - количество городов, которые необходимо вернуть
 * - q        - строка поискового запроса
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - id - id страны
 * - name - название страны
 * 
 */
export async function getCountries ({ q = '', need_all = 1, count = 250, offset = 0 }) {

  try {
    const response = await new HTTP({ v: '2.0' }).get(`${entries}.getCountries`, {
      params: {
        offset,
        count,
        need_all,
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getCountries`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает список городов
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - 'q', // строка поискового запроса
 * 
 * - 'offset', 	// смещение, необходимый для получения определенного подмножества городов
 * 
 * - 'count' // количество городов, которые необходимо вернуть
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - city
 * -- id - id города
 * -- name - название города
 * 
 * - coutry
 * -- id - id страны
 * -- name - название страны
 * 
 */
export async function getCountriesCities ({ q = '', count, offset = 0 }) {

  try {
    const response = await new HTTP({ v: '2.0' }).get(`${entries}.getCountriesCities`, {
      params: {
        offset,
        count,
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getCountriesCities`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает список городов
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - country_id - id страны, обязательный параметр
 * - need_all   - 1 – возвращать все города. 0 – возвращать только основные города
 * - offset     - смещение, необходимый для получения определенного подмножества городов
 * - count      - количество городов, которые необходимо вернуть
 * - q          - строка поискового запроса
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - id - id города
 * - name - название города
 * 
 */
export async function getCities ({ country_id, q = '', need_all = 1, offset = 0, count = 500 }) {

  try {
    const response = await new HTTP().get(`${entries}.getCities`, {
      params: {
        offset,
        count,
        country_id,
        need_all,
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getCities`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Получение списка стран по их id
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - country_ids - список id стран через запятую
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - id - id страны
 * - name - название страны
 * 
 */
export async function getCountriesById ({ country_ids }) {

  try {
    const response = await new HTTP({ v: '2.0' }).get(`${entries}.getCountriesById`, {
      params: {
        country_ids: getValuesAsString(country_ids),
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getCountriesById`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Получение городов по их id
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - city_ids - список id стран через запятую
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - id - id страны
 * - name - название страны
 * 
 */
export async function getCitiesById ({ city_ids }) {

  try {
    const response = await new HTTP().get(`${entries}.getCitiesById`, {
      params: {
        city_ids: getValuesAsString(city_ids),
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getCitiesById`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает список факультетов.
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - university_id - id университета (обязательный параметр)
 * - offset        - смещение, необходимый для получения определенного подмножества факультетов
 * - count         - количество факультетов, которое необходимо вернуть
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - id - id факультета
 * - name - название факультета
 * 
 */
export async function getFaculties ({ university_id, offset, count }) {

  try {
    const response = await new HTTP().get(`${entries}.getFaculties`, {
      params: {
        university_id,
        offset,
        count
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getFaculties`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает список учебных заведений
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - country_id - идентификатор страны, учебные заведения которой необходимо вернуть
 * - city_id    - идентификатор города, учебные заведения которого необходимо вернуть
 * - offset     - смещение, необходимый для получения определенного подмножества учебных заведений
 * - count      - количество учебных заведений, которые необходимо вернуть
 * - q          - строка поискового запроса
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - id - id учебного заведения
 * - name - название учебного заведения
 * 
 */
export async function getUniversities ({ country_id, city_id, offset, count, q }) {

  try {
    const response = await new HTTP().get(`${entries}.getUniversities`, {
      params: {
        country_id,
        city_id,
        offset,
        count,
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getUniversities`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает список школ
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - city_id - идентификатор города, школы которого необходимо вернуть
 * - offset  - смещение, необходимый для получения определенного подмножества школ
 * - count   - количество школ, которые необходимо вернуть
 * - q       - строка поискового запроса
 * 
 * В ответе возвращается массив состоящий из полей:
 * 
 * - id - id школы
 * - name - название школы
 * 
 */
export async function getSchools ({ city_id, offset, count, q }) {

  try {
    const response = await new HTTP().get(`${entries}.getSchools`, {
      params: {
        city_id,
        offset,
        count,
        q
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getSchools`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает список классов, характерных для школ определенной страны
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - country_id - id страны (обязательный параметр)
 * 
 * Возвращает массив, каждый элемент которого представляет собой пару: идентификатор и строковое обозначение класса.
 * 
 */
export async function getSchoolClasses ({ country_id }) {

  try {
    const response = await new HTTP().get(`${entries}.getSchoolClasses`, {
      params: {
        country_id
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getSchoolClasses`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Возвращает категории сообществ.
 * 
 * Метод: GET
 * 
 * Принимаемые параметры:
 * 
 * - type - тип сообщества (обязательный параметр): communities, places, events
 * 
 * В ответе возвращается массив состоящий на уровни:
 * 
 * - level1
 * - level2
 * - level3
 * 
 * Каждый из которых содержит массивы из полей:
 * 
 * - id
 * - name
 * 
 */
export async function getGroupsCategories ({ type }) {

  try {
    const response = await new HTTP().get(`${entries}.getGroupsCategories`, {
      params: {
        type
      },
    })

    if (process.env.NODE_ENV == 'development') logger(`getGroupsCategories`, response.data.data);
    
    return response.data.data
  } catch (error) {
    throw new Error(error)
  }
}