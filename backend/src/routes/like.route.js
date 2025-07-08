const { Router } = require("express");
const constroller = require("../controllers/like.controller");

const router = Router({ mergeParams: true });

router.post("/", constroller.like);
router.delete("/", constroller.unlike);

module.exports = router;
