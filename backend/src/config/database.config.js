const dotenv = require("dotenv");

dotenv.config();
const databaseUrl = process.env.DB_URL;

module.exports = {
  url: databaseUrl || "",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_NAME || "blog",
  dialect: "postgres",
  dialectOptions: databaseUrl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
};
