import { Validator } from 'vee-validate';
import * as Rules from './rules';

Object.keys(Rules).forEach(rule => {
  Validator.extend(rule, Rules[rule].validate, Object.assign({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }));
});