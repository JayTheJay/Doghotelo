const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTage: [],
          allowedAttributes: {},
        });
        if (clean != value) return helpers.error('string.escapeHTML', {value})
        return clean;  
      }
    }
  }
})

Joi = BaseJoi.extend(extension)

// pattern for javascript object using joy methods. then validate on req body in app.js
module.exports.doghotelSchema =
    //validate schema before it would be attempted to save
    Joi.object({
      doghotel: Joi.object({
          title: Joi.string().required().escapeHTML(),
          price: Joi.number().required().min(1),
        //  image: Joi.string().required(),
          location: Joi.string().required().escapeHTML(),
          description: Joi.string().required().escapeHTML()
      }).required(),
      deleteImages: Joi.array()
  })
 

  module.exports.reviewSchema =
    Joi.object({
      review: Joi.object({
          rating: Joi.number().required().min(1).max(5),
          body: Joi.string().required().escapeHTML(),
      }).required()
  })
 
