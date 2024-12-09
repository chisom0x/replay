import Joi from 'joi';

export default class FileValidations {
  static uploadFileValidation(data) {
    const schema = Joi.object({
      galleryId: Joi.string().required().messages({
        'string.empty': 'please provide a gallery id!',
        'any.required': 'please provide a gallery id!',
      }),
      files: Joi.array().min(1).required().messages({
        'array.base': 'please provide a file!',
        'array.min': 'please provide a file!',
        'any.required': 'please provide a file!',
      }),
    });
    return schema.validate(data, { abortEarly: false });
  }

  static deleteFileValidation(data) {
    const schema = Joi.object({
      fileId: Joi.string().required().messages({
        'string.empty': 'provide a file id!',
        'any.required': 'provide a file id!',
      }),
    });
    return schema.validate(data, { abortEarly: false });
  }
}
