const { ValidationError } = require("../errors/error-classes");
const {
  createPostSchema,
  postIdSchema,
  updatePostSchema,
  likedPostsPaginationSchema,
} = require("../schemas");
const postService = require("../services/post.service");
const {
  getOffset,
  getPaginationMetadata,
} = require("../utils/pagination.util");

const create = async (req, res, next) => {
  try {
    const { error } = createPostSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { user_id } = req.user;
    const postData = {
      ...req.body,
      user_id,
    };

    const post = await postService.create(postData);

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const { error } = likedPostsPaginationSchema.validate(req.query);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { page, limit, liked, feedType } = req.query;

    const offset = getOffset(page, limit);

    const { count, rows } = await await postService.getAll({
      limit,
      offset,
      liked,
      userId: user_id,
      feedType,
    });

    const pagination = getPaginationMetadata(count, page, limit);

    console.log({ limit, page, offset, count });

    res.status(200).json({
      message: "Posts retrieved successfully",
      data: rows,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { error } = postIdSchema.validate(req.params);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { post_id } = req.params;
    const post = await postService.getById(post_id);

    res.status(200).json({
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { error: paramsError } = postIdSchema.validate(req.params);
    if (paramsError) {
      throw new ValidationError(paramsError.message);
    }

    const { error: bodyError } = updatePostSchema.validate(req.body);
    if (bodyError) {
      throw new ValidationError(bodyError.message);
    }

    const { post_id } = req.params;
    const updatedPost = await postService.update(post_id, req.body);

    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { error } = postIdSchema.validate(req.params);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { post_id } = req.params;
    const deletedPost = await postService.remove(post_id);

    res.status(200).json({
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
};
