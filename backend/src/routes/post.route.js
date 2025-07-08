const { Router } = require("express");
const controller = require("../controllers/post.controller");
const likeRouter = require("./like.route");
const commentRouter = require("./comment.route");

const router = Router({ mergeParams: true });

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:post_id", controller.get);
router.put("/:post_id", controller.update);
router.delete("/:post_id", controller.remove);

router.use("/:post_id/like", likeRouter);
router.use("/:post_id/comment", commentRouter);

module.exports = router;
