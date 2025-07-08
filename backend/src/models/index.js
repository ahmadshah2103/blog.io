const { Sequelize } = require("sequelize");
const config = require("../config");
const fs = require("fs");
const path = require("path");

const dbConfig = config.database;
const db = {};
const basename = path.basename(__filename);

const sequelize = dbConfig.url
  ? new Sequelize(dbConfig.url)
  : new Sequelize(dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: "postgres",
      logging: console.log,
      define: {
        timestamps: true,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
