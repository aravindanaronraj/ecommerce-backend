const cloudinary = require("cloudinary").v2;

const requiredEnv = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (missingEnv.length) {
  console.warn(`Cloudinary upload is not configured. Missing env vars: ${missingEnv.join(", ")}`);
}

module.exports = cloudinary;