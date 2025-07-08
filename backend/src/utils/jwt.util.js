const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/jwt.config");
const { UnauthorizedError } = require("../errors/error-classes");

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    throw new UnauthorizedError("Invalid or expired token!");
  }
};

module.exports = { generateToken, verifyToken };
