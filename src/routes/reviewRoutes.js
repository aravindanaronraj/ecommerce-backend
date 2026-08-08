const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getReviews, createReview } = require("../controllers/reviewController");

const router = express.Router();
router.get("/", getReviews);
router.post("/", protect, createReview);

module.exports = router;
