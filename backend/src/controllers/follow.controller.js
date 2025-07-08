const followService = require("../services/follow.service");
const { ValidationError } = require("../errors/error-classes");
const { userIdSchema } = require("../schemas/user.schema");

const follow = async (req, res, next) => {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { user_id: targetUserId } = req.params;
    const { user_id } = req.user;

    const followed = await followService.follow(user_id, targetUserId);

    response = followed
      ? { message: "Followed successfully" }
      : { message: "You are already following this user" };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const unfollow = async (req, res, next) => {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { user_id: targetUserId } = req.params;
    const { user_id } = req.user;

    const unfollowed = await followService.unfollow(user_id, targetUserId);

    const response = unfollowed
      ? { message: "Unfollowed successfully" }
      : { message: "You are not following this user" };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const checkFollowStatus = async (req, res, next) => {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { user_id: targetUserId } = req.params;
    const { user_id } = req.user;

    const isFollowing = await followService.checkStatus(user_id, targetUserId);

    res.status(200).json({
      message: "Follow status retrieved successfully",
      data: { is_following: isFollowing },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  follow,
  unfollow,
  checkFollowStatus,
};
