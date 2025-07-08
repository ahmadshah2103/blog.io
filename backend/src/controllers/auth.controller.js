const {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors/error-classes");
const { loginSchema, registerSchema } = require("../schemas/auth.schema");
const userService = require("../services/user.service");
const { generateToken } = require("../utils/jwt.util");
const { comparePassword } = require("../utils/password.util");

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.message);
    }
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid password");
    }

    user.password = undefined; // Remove password from user object
    const userDetails = user.toJSON();

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: userDetails,
        token: generateToken(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw new ValidationError(error.message);
    }

    const { name, email, password } = req.body;

    const user = await userService.createUser({ name, email, password });

    res.status(200).json({
      message: "User registered successfully",
      data: {
        user,
        token: generateToken(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register };
