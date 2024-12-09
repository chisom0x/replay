import Joi from 'joi';

export default class AuthValidations {
  static signUpValidation(data) {
    const schema = Joi.object({
      firstName: Joi.string().required().messages({
        'string.empty': 'Please enter your first name!',
      }),
      lastName: Joi.string().required().messages({
        'string.empty': 'please enter your lastname!',
      }),
      email: Joi.string().email().required().messages({
        'string.empty': 'please enter your email address!',
        'string.email': 'Please enter a valid email address!',
      }),
      password: Joi.string().min(6).required().messages({
        'string.empty': 'please set a password!',
        'string.min': 'Password must be at least 6 characters long!',
      }),
    });
    return schema.validate(data, { abortEarly: false });
  }

  static loginValidation(data) {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.empty': 'please enter your email address',
        'string.email': 'Please enter a valid email address!',
      }),
      password: Joi.string().required().messages({
        'string.empty': 'please enter a password',
      }),
    });
    return schema.validate(data, { abortEarly: false });
  }
}
