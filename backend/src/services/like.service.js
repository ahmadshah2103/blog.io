const { Like } = require("../models");

const like = async (userId, targetPostId) => {
  const like = await Like.findOne({
    where: {
      user_id: userId,
      post_id: targetPostId,
    },
  });

  if (like) {
    return false;
  } else {
    await Like.create({
      user_id: userId,
      post_id: targetPostId,
    });
    return true;
  }
};

const unlike = async (userId, targetPostId) => {
  const like = await Like.findOne({
    where: {
      user_id: userId,
      post_id: targetPostId,
    },
  });

  if (!like) {
    return false;
  } else {
    await like.destroy();
    return true;
  }
};

module.exports = {
  like,
  unlike,
};
