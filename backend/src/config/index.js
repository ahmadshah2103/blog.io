const dotenv = require("dotenv");
const databaseConfig = require("./database.config");

dotenv.config();

module.exports = {
  server: {
    port: process.env.PORT,
  },
  database: databaseConfig,
};
