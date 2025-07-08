const { Router } = require("express");
const constroller = require("../controllers/auth.controller");
const router = Router({ mergeParams: true });

router.post("/login", constroller.login);
router.post("/register", constroller.register);

module.exports = router;
