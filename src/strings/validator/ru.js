import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Значение поля ${field} недопустимо.`,
  after: (field, [target, inclusion]) => `В поле ${field} должна быть дата после ${inclusion ? 'или равная ' : ''}${target}.`,
  alpha_dash: (field) => `Поле ${field} может содержать только буквы, цифры и дефис.`,
  alpha_num: (field) => `Поле ${field} может содержать только буквы и цифры.`,
  alpha_spaces: (field) => `Поле ${field} может содержать только буквы и пробелы.`,
  alpha: (field) => `Поле ${field} может содержать только буквы.`,
  before: (field, [target, inclusion]) => `В поле ${field} должна быть дата до ${inclusion ? 'или равная ' : ''}${target}.`,
  between: (field, [min, max]) => `Поле ${field} должно быть между ${min} и ${max}.`,
  confirmed: (field, [confirmedField]) => `Поле ${field} не совпадает с ${confirmedField}.`,
  credit_card: (field) => `Поле ${field} должно быть действительным номером карты`,
  date_between: (field, [min, max]) => `Поле ${field} должно быть между ${min} и ${max}.`,
  date_format: (field, [format]) => `Поле ${field} должно быть в формате ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Поле ${field} должно быть числовым и может содержать ${decimals === '*' ? '' : decimals} десятичных числа.`,
  digits: (field, [length]) => `Поле ${field} должно быть числовым и точно содержать ${length} цифры.`,
  dimensions: (field, [width, height]) => `Поле ${field} должно быть ${width} пикселей на ${height} пикселей.`,
  email: (field) => `Поле ${field} должно быть действительным электронным адресом.`,
  ext: (field, [...args]) => `Поле ${field} должно быть действительным файлом. (${args})`,
  image: (field) => `Поле ${field} должно быть изображением.`,
  included: (field) => `Поле ${field} должно быть допустимым значением.`,
  integer: (field) => `Поле ${field} должно быть целым числом.`,
  ip: (field) => `Поле ${field} должно быть действительным IP-адресом.`,
  length: (field, [length, max]) => {
    if (max) {
      return `Длина поля ${field} должна быть между ${length} и ${max}.`;
    }

    return `Длина поля ${field} должна быть ${length}.`;
  },
  max: (field, [length]) => `Поле ${field} должно содержать более ${length} символов.`,
  max_value: (field, [max]) => `Поле ${field} должно быть ${max} или менее.`,
  mimes: (field, [...args]) => `Поле ${field} должно иметь допустимый тип файла. (${args})`,
  min: (field, [length]) => `Поле ${field} должно содержать не менее ${length} символов.`,
  min_value: (field, [min]) => `Поле ${field} должно быть ${min} или больше.`,
  excluded: (field) => `Поле ${field} должно быть допустимым значением.`,
  numeric: (field) => `Поле ${field} должно быть числом.`,
  regex: (field) => `Поле ${field} имеет ошибочный формат.`,
  required: (field) => `Поле ${field} обязательно для заполнения.`,
  size: (field, [size]) => `Поле ${field} должно быть меньше, чем ${formatFileSize(size)}.`,
  url: (field) => `Поле ${field} имеет ошибочный формат URL.`,

  tel: (field) => `Некоректно введен телефонный номер.`
};

const locale = {
  name: 'ru',
  messages,
  attributes: {
    firstName: 'Имя',
    last_name: 'Фамилия',
    password: 'Пароль',
    password_confirmation: 'Повтор пароля',
    code: 'Код подтверждения',
    tel: 'Teлефонный номер',
  },
  custom: {
    firstName: {
      required: 'Необходимо ввести имя',
      min: 'Имя должно содержать более 1 символа',
      alpha: 'Имя должно состоять из буквенных символов'
    },
    last_name: {
      required: 'Необходимо ввести фамилию.',
      min: 'Фамилия должнна содержать более 1 символа.',
      alpha: 'Фамилия должна состоять из буквенных символов.'
    },
    password: {
      required: 'Необходимо ввести пароль.',
      min: 'Пароль должен содержать как минимум 8 символов.'
    },
    password_confirmation: {
      required: 'Пароль нужно повторить.',
      confirmed: 'Пароли не совпадают.'
    },
    code: {
      numeric: 'Код подтвеждения должен состоять из цифр.',
      length: 'Код подтвеждения должен иметь длину 6 символов.'
    }
  }
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;