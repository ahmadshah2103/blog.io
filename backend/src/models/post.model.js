const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      post_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "posts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["user_id"],
        },
        {
          fields: ["created_at"],
        },
        {
          fields: ["title"],
        },
      ],
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "author",
      onDelete: "CASCADE",
    });
    Post.hasMany(models.Like, { foreignKey: "post_id", as: "likes" });
    Post.hasMany(models.Comment, { foreignKey: "post_id", as: "comments" });
    Post.belongsToMany(models.Tag, {
      through: models.PostTag,
      foreignKey: "post_id",
      otherKey: "tag_id",
      as: "tags",
      onDelete: "CASCADE",
    });
    Post.belongsToMany(models.Category, {
      through: models.PostCategory,
      foreignKey: "post_id",
      otherKey: "category_id",
      as: "categories",
      onDelete: "CASCADE",
    });
  };

  return Post;
};
