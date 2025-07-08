const { Router } = require("express");
const constroller = require("../controllers/follow.controller");

const router = Router({ mergeParams: true });

router.post("/", constroller.follow);
router.delete("/", constroller.unfollow);
router.get("/status", constroller.checkFollowStatus);

module.exports = router;
