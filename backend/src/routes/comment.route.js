const { Router } = require("express");
const constroller = require("../controllers/comment.controller");

const router = Router({ mergeParams: true });

router.post("/", constroller.create);
router.get("/", constroller.getAll);
router.put("/:comment_id", constroller.update);
router.delete("/:comment_id", constroller.remove);

module.exports = router;
