const multer = require("multer");

const storage = multer.memoryStorage();

module.exports = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});
