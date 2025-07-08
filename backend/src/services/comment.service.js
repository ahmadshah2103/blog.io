const { NotFoundError } = require("../errors/error-classes");
const { Comment } = require("../models");

const create = async (commentData) => {
  const comment = await Comment.create(commentData);
  return comment;
};

const getAll = async ({ limit, offset, postId }) => {
  return await Comment.findAndCountAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
    include: [
      {
        association: "author",
        attributes: ["user_id", "name", "email"],
      },
      {
        association: "post",
        attributes: ["post_id", "title"],
        where: { post_id: postId },
      },
    ],
  });
};

const update = async (id, commentData) => {
  const comment = await Comment.findByPk(id);
  if (!comment) throw new NotFoundError("Comment");

  await comment.update(commentData);
  return comment;
};

const remove = async (id) => {
  const comment = await Comment.findByPk(id);
  if (!comment) throw new NotFoundError("Comment");

  await comment.destroy();
  return comment;
};

module.exports = {
  create,
  getAll,
  update,
  remove,
};
