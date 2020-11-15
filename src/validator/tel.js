const validate = (value) => {
  if (Array.isArray(value)) {
    return value.every(val => validate(val));
  }

  return /(?:\+|\d)[\d\-\(\) ]{9,}\d/g.test(String(value));
}

export {
  validate
}

export default {
  validate
}