const { v7: uuidv7 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      tag_id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
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
      tableName: "tags",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Post, {
      through: models.PostTag,
      foreignKey: "tag_id",
      otherKey: "post_id",
      as: "posts",
      onDelete: "CASCADE",
    });
  };

  return Tag;
};
