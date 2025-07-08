const { UnauthorizedError } = require("../errors/error-classes");
const { getUserById } = require("../services/user.service");
const { verifyToken } = require("../utils/jwt.util");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Invalid token format");
    }

    const decodedToken = verifyToken(token);

    const user = await getUserById(decodedToken.user_id);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateUser,
};
