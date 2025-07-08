const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      comment_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      tableName: "comments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["post_id"],
        },
        {
          fields: ["user_id"],
        },
        {
          fields: ["created_at"],
        },
      ],
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, {
      foreignKey: "post_id",
      as: "post",
      onDelete: "CASCADE",
    });
    Comment.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "author",
      onDelete: "CASCADE",
    });
  };

  return Comment;
};
