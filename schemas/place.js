const Joi = require('joi')

module.export.placeSchema = Joi.object({
    place: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().min().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required(),
    }).required(),
  });