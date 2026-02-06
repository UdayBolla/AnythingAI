const Joi = require("joi");

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

exports.taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional()
});
