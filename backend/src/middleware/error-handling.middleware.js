const { BaseError } = require("../errors/error-classes");
const errorHandlingMiddleware = (err, req, res, next) => {
  console.log(err);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandlingMiddleware;
