const Joi = require("joi");

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
});

const postIdAndCommentIdSchema = Joi.object({
  comment_id: Joi.string().uuid().required(),
  post_id: Joi.string().uuid().required(),
});

module.exports = {
  createCommentSchema,
  postIdAndCommentIdSchema,
};
