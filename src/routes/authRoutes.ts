import express from 'express';
const router = express.Router();
router.post("/login", require("../controllers/authControllers").login);
router.post("/register", require("../controllers/authControllers").register);
module.exports = router;