const { UserExistsError, NotFoundError } = require("../errors/error-classes");
const { User, Follow } = require("../models");

const getUserByEmail = async (email) => {
  const user = await User.scope("withPassword").findOne({ where: { email } });
  return user;
};

const createUser = async (userData) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });

  if (existingUser) throw new UserExistsError();

  const user = await User.create(userData);
  return user;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("User");
  return user;
};

const getFollowers = async (userId, options = {}) => {
  const { limit = 10, offset = 0 } = options;
  const followers = await User.findAll({
    limit,
    offset,
    include: [
      {
        association: "followers",
        where: { user_id: userId },
      },
    ],
    order: [["created_at", "DESC"]],
  });
  return followers;
};

const getFollowed = async (userId, options = {}) => {
  const { limit = 10, offset = 0 } = options;
  const followed = await User.findAll({
    limit,
    offset,
    include: [
      {
        association: "following",
        where: { user_id: userId },
      },
    ],
    order: [["created_at", "DESC"]],
  });
  return followed;
};

const updateUser = async (id, userData) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("User");

  await user.update(userData);
  return user;
};

const resetPassword = async (id, newPassword) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("User");

  user.password = newPassword;
  await user.save();
  return user;
};

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  getFollowers,
  getFollowed,
  updateUser,
  resetPassword,
};
