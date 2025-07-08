const Joi = require("joi");
const userSchemas = require("./user.schema");
const postSchemas = require("./post.schema");
const authSchemas = require("./auth.schema");
const commentSchema = require("./comment.schema");

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
});

module.exports = {
  paginationSchema,
  ...userSchemas,
  ...postSchemas,
  ...authSchemas,
  ...commentSchema,
};
