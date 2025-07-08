const likeService = require("../services/like.service");
const { ValidationError } = require("../errors/error-classes");
const { postIdSchema } = require("../schemas/post.schema");

const like = async (req, res, next) => {
  try {
    const { error } = postIdSchema.validate(req.params);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { post_id: targetPostId } = req.params;
    const { user_id } = req.user;

    const liked = await likeService.like(user_id, targetPostId);

    const response = liked
      ? { message: "Liked successfully" }
      : { message: "You have already liked this post" };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const unlike = async (req, res, next) => {
  try {
    const { error } = postIdSchema.validate(req.params);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { post_id: targetPostId } = req.params;
    const { user_id } = req.user;

    const unliked = await likeService.unlike(user_id, targetPostId);

    const response = unliked
      ? { message: "Unliked successfully" }
      : { message: "You have not liked this post" };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  like,
  unlike,
};
