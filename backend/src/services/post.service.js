const { NotFoundError } = require("../errors/error-classes");
const { Post, Follow } = require("../models");
const { Op } = require("sequelize");

const create = async (postData) => {
  const post = await Post.create(postData);
  return post;
};

const getAll = async ({ limit, offset, liked, userId, feedType }) => {
  if (liked && userId) {
    return await getLiked(userId, { limit, offset });
  }

  if (feedType === "following" && userId) {
    return await Post.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      where: {
        user_id: {
          [Op.in]: require("sequelize").literal(`(
            SELECT followed_id 
            FROM follows 
            WHERE follower_id = '${userId}'
          )`),
        },
      },
      include: [
        {
          association: "author",
          attributes: ["user_id", "name", "email"],
        },
        {
          association: "likes",
          attributes: ["like_id", "user_id"],
          required: false,
          include: [
            {
              association: "user",
              attributes: ["user_id", "name", "email"],
            },
          ],
        },
        {
          association: "comments",
          attributes: ["comment_id", "content", "created_at"],
          required: false,
          include: [
            {
              association: "author",
              attributes: ["user_id", "name", "email"],
            },
          ],
        },
      ],
    });
  }

  return await Post.findAndCountAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
    include: [
      {
        association: "author",
        attributes: ["user_id", "name", "email"],
      },
      {
        association: "likes",
        attributes: ["like_id", "user_id"],
        include: [
          {
            association: "user",
            attributes: ["user_id", "name", "email"],
          },
        ],
      },
      {
        association: "comments",
        attributes: ["comment_id", "content", "created_at"],
        include: [
          {
            association: "author",
            attributes: ["user_id", "name", "email"],
          },
        ],
      },
    ],
  });
};

const getById = async (id) => {
  const post = await Post.findByPk(id, {
    include: [
      {
        association: "author",
        attributes: ["user_id", "name", "email"],
      },
      {
        association: "likes",
        attributes: ["like_id", "user_id"],
        include: [
          {
            association: "user",
            attributes: ["user_id", "name", "email"],
          },
        ],
      },
      {
        association: "comments",
        attributes: ["comment_id", "content", "created_at"],
        include: [
          {
            association: "author",
            attributes: ["user_id", "name", "email"],
          },
        ],
      },
    ],
  });

  if (!post) throw new NotFoundError("Post");
  return post;
};

const update = async (id, postData) => {
  const post = await Post.findByPk(id);
  if (!post) throw new NotFoundError("Post");

  await post.update(postData);
  return post;
};

const remove = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) throw new NotFoundError("Post");

  await post.destroy();
  return post;
};

const getLiked = async (userId, { limit, offset }) => {
  return await Post.findAndCountAll({
    limit,
    offset,
    order: [["likes", "created_at", "DESC"]],
    include: [
      {
        association: "likes",
        where: { user_id: userId },
        attributes: ["like_id", "user_id", "created_at"],
        require: true,
        include: [
          {
            association: "user",
            attributes: ["user_id", "name", "email"],
          },
        ],
      },
      {
        association: "author",
        attributes: ["user_id", "name", "email"],
      },
      {
        association: "comments",
        attributes: ["comment_id", "content", "created_at"],
        include: [
          {
            association: "author",
            attributes: ["user_id", "name", "email"],
          },
        ],
      },
    ],
  });
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getLiked,
};
