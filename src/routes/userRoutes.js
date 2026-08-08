const express = require("express");
const { getUsers, registerUser, loginUser, updateUserRole } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.patch("/:id/role", protect, admin, updateUserRole);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
