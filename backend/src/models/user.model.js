const { hashPassword } = require("../utils/password.util");
const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      avatar_url: {
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
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["name"],
        },
      ],
      hooks: {
        beforeCreate: async (user) => {
          user.password = await hashPassword(user.password);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await hashPassword(user.password);
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: "user_id", as: "posts" });
    User.hasMany(models.Like, { foreignKey: "user_id", as: "likes" });
    User.hasMany(models.Comment, { foreignKey: "user_id", as: "comments" });

    User.belongsToMany(models.User, {
      through: models.Follow,
      as: "followers",
      foreignKey: "followed_id",
      otherKey: "follower_id",
      onDelete: "CASCADE",
    });
    User.belongsToMany(models.User, {
      through: models.Follow,
      as: "following",
      foreignKey: "follower_id",
      otherKey: "followed_id",
      onDelete: "CASCADE",
    });
  };

  return User;
};
