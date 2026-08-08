const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const siteUpload = require("../middleware/siteUploadMiddleware");
const { getSettings, updateSettings } = require("../controllers/siteSettingsController");

const router = express.Router();

router.get("/settings", getSettings);
router.put(
  "/settings",
  protect,
  admin,
  siteUpload.fields([
    { name: "bannerImages", maxCount: 3 },
    { name: "bannerImage", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;
