const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { staff } = require("../middleware/adminMiddleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  staff,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  staff,
  upload.single("image"),
  updateProduct
);

router.delete("/:id", protect, staff, deleteProduct);

module.exports = router;