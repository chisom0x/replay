import Joi from 'joi';

export default class GalleryValidations {
  static validateAddGallery(data) {
    const schema = Joi.object({
      title: Joi.string().required().messages({
        'string.empty': 'please provide a title!',
        'any.required': 'please provide a title!',
      }),
    });
    return schema.validate(data, { abortEarly: false });
  }

  static validateGalleryId(params) {
    const schema = Joi.object({
      galleryId: Joi.string().required().messages({
        'string.empty': 'please provide a gallery id!',
        'any.required': 'please provide a gallery id!',
      }),
    });
    return schema.validate(params, { abortEarly: false });
  }

  static validateGalleryKey(params) {
    const schema = Joi.object({
      galleryKey: Joi.string().required().messages({
        'string.empty': 'please provide a gallery key!',
        'any.required': 'please provide a gallery key!',
      }),
    });
    return schema.validate(params, { abortEarly: false });
  }
}
