require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const tempPath = path.join(__dirname, 'tmp-test-image.png');
fs.writeFileSync(tempPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQwA8wQAAQABJQNoEAAAAABJRU5ErkJggg==', 'base64'));
cloudinary.uploader.upload(tempPath, { folder: 'banners-test' }, (error, result) => {
  if (error) {
    console.error('UPLOAD_ERROR', error.message || error);
    process.exit(1);
  }
  console.log(JSON.stringify({ secure_url: result.secure_url, public_id: result.public_id }, null, 2));
  fs.unlinkSync(tempPath);
});
