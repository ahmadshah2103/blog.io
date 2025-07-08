const Joi = require("joi");

const postIdSchema = Joi.object({
  post_id: Joi.string().uuid().required(),
});

const createPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
}).min(1);

const likedPostsPaginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  liked: Joi.boolean().allow(null, "").optional(),
});

module.exports = {
  postIdSchema,
  createPostSchema,
  updatePostSchema,
  likedPostsPaginationSchema,
};
