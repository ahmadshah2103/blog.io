const commentService = require("../services/comment.service");
const {
  postIdSchema,
  paginationSchema,
  createCommentSchema,
  postIdAndCommentIdSchema,
} = require("../schemas");
const { ValidationError } = require("../errors/error-classes");
const {
  getOffset,
  getPaginationMetadata,
} = require("../utils/pagination.util");

const create = async (req, res, next) => {
  try {
    const { error: paramsError } = postIdSchema.validate(req.params);
    if (paramsError) throw new ValidationError(paramsError.message);

    const { error: bodyError } = createCommentSchema.validate(req.body);
    if (paramsError) throw new ValidationError(bodyError.message);

    const comment = await commentService.create({
      content: req.body.content,
      post_id: req.params.post_id,
      user_id: req.user.user_id,
    });

    res.status(201).json({
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { error } = paginationSchema.validate(req.query);
    if (error) throw new ValidationError(error.message);

    const { error: paramsError } = postIdSchema.validate(req.params);
    if (paramsError) throw new ValidationError(paramsError.message);

    const { post_id } = req.params;

    const { page, limit } = req.query;
    const offset = getOffset(page, limit);

    const { count, rows } = await commentService.getAll({
      limit,
      offset,
      postId: post_id,
    });

    const pagination = getPaginationMetadata(count, page, limit);

    res.status(200).json({
      message: "Comments retrieved successfully",
      data: rows,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { error: paramsError } = postIdAndCommentIdSchema.validate(
      req.params
    );
    if (paramsError) throw new ValidationError(paramsError.message);

    const { error: bodyError } = createCommentSchema.validate(req.body);
    if (bodyError) throw new ValidationError(bodyError.message);

    const comment = await commentService.update(
      req.params.comment_id,
      req.body
    );

    res.status(200).json({
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { error } = postIdAndCommentIdSchema.validate(req.params);
    if (error) throw new ValidationError(error.message);

    const comment = await commentService.remove(req.params.comment_id);

    res.status(200).json({
      message: "Comment deleted successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  update,
  remove,
};
