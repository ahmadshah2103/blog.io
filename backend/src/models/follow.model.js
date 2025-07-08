const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    "Follow",
    {
      follow_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },
      follower_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      followed_id: {
        type: DataTypes.UUID,
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
      tableName: "follows",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["follower_id", "followed_id"],
        },
        {
          fields: ["follower_id"],
        },
        {
          fields: ["followed_id"],
        },
      ],
    }
  );

  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      foreignKey: "follower_id",
      as: "follower",
      onDelete: "CASCADE",
    });
    Follow.belongsTo(models.User, {
      foreignKey: "followed_id",
      as: "followed",
      onDelete: "CASCADE",
    });
  };

  return Follow;
};
