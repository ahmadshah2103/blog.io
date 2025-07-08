const { Router } = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const postRouter = require("./post.route");
const {
  authenticateUser,
} = require("../middleware/authenticate-account.middleware");

const router = Router({ mergeParams: true });

router.use("/auth", authRoute);
router.use("/users", authenticateUser, userRoute);
router.use("/posts", authenticateUser, postRouter);

module.exports = router;
