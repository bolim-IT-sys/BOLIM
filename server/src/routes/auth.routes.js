const express = require("express");
const { login, authenticateToken } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/token-verification", authenticateToken);

module.exports = router;
