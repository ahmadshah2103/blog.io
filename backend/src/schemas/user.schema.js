const Joi = require("joi");

const userIdSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  bio: Joi.string().allow("", null).optional(),
  avatar_url: Joi.string().uri().allow("", null).optional(),
}).min(1);

module.exports = {
  userIdSchema,
  updateUserSchema,
};
