const userService = require("../services/user.service");
const { ValidationError } = require("../errors/error-classes");
const { userIdSchema, updateUserSchema } = require("../schemas/user.schema");

const getFollowers = async (req, res, next) => {
  try {
    const { error: paramsError } = userIdSchema.validate(req.params);
    if (paramsError) {
      throw new ValidationError(paramsError.message);
    }

    const { user_id } = req.params;
    const { limit, offset } = req.query;

    const followers = await userService.getFollowers(user_id, {
      limit: parseInt(limit, 10) || 10,
      offset: parseInt(offset, 10) || 0,
    });

    res.status(200).json({
      message: "Followers retrieved successfully",
      data: followers,
    });
  } catch (error) {
    next(error);
  }
};

const getFollowed = async (req, res, next) => {
  try {
    const { error: paramsError } = userIdSchema.validate(req.params);
    if (paramsError) {
      throw new ValidationError(paramsError.message);
    }

    const { user_id } = req.params;
    const { limit, offset } = req.query;

    const followed = await userService.getFollowed(user_id, {
      limit: parseInt(limit, 10) || 10,
      offset: parseInt(offset, 10) || 0,
    });

    res.status(200).json({
      message: "Followed users retrieved successfully",
      data: followed,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { error: paramsError } = userIdSchema.validate(req.params);
    if (paramsError) {
      throw new ValidationError(paramsError.message);
    }

    const { user_id } = req.params;
    const user = await userService.getUserById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { error: paramsError } = userIdSchema.validate(req.params);
    if (paramsError) {
      throw new ValidationError(paramsError.message);
    }

    const { error: bodyError } = updateUserSchema.validate(req.body);
    if (bodyError) {
      throw new ValidationError(bodyError.message);
    }

    const { user_id } = req.params;

    const user = await userService.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await userService.updateUser(user_id, req.body);

    res.status(200).json({
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFollowers,
  getFollowed,
  getProfile,
  updateProfile,
};
