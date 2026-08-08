const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { staff } = require("../middleware/adminMiddleware");
const { createOrder, getOrders, getMyOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, staff, getOrders);
router.patch("/:id/status", protect, staff, updateOrderStatus);

module.exports = router;
