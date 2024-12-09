import Joi from 'joi';

class UserValidations {
  static validateUpdateUserData({ body, file }) {
    const bodySchema = Joi.object({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
    });

    const fileSchema = Joi.object({
      buffer: Joi.binary().optional(),
    });

    const bodyValidation = bodySchema.validate(body);
    if (bodyValidation.error) return bodyValidation;

    if (file) {
      return fileSchema.validate(file);
    }
  }

  static validateUpdateUserPassword(body) {
    const schema = Joi.object({
      oldPassword: Joi.string().required().messages({
        'string.empty': 'Please enter your old password!',
      }),
      newPassword: Joi.string().min(6).required().messages({
        'string.empty': 'Please enter your new password!',
        'string.min': 'Password must be at least 6 characters long!',
      }),
    });

    return schema.validate(body);
  }
}

export default UserValidations;
