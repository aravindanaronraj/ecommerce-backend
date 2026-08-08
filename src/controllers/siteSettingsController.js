const cloudinary = require("../config/cloudinary");
const SiteSettings = require("../models/SiteSettings");

const uploadBufferToCloudinary = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "banners",
        public_id: `${Date.now()}-${originalName.replace(/\s+/g, "-")}`,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });

const getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    res.json(settings || { banner: {}, about: {}, footer: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const update = {};
    ["banner", "about", "footer"].forEach((section) => {
      const value = req.body?.[section];
      if (typeof value === "string") {
        try {
          update[section] = JSON.parse(value);
        } catch {
          update[section] = value;
        }
      } else if (value && typeof value === "object") {
        update[section] = value;
      }
    });

    let submittedSlides = [];
    if (typeof req.body?.bannerSlides === "string") {
      try {
        submittedSlides = JSON.parse(req.body.bannerSlides);
      } catch {
        submittedSlides = [];
      }
    } else if (Array.isArray(req.body?.bannerSlides)) {
      submittedSlides = req.body.bannerSlides;
    }

    const uploadedFiles = [];
    if (req.files) {
      for (const field of ["bannerImages", "bannerImage", "banner"]) {
        if (Array.isArray(req.files[field])) {
          uploadedFiles.push(...req.files[field]);
        } else if (req.files[field]) {
          uploadedFiles.push(req.files[field]);
        }
      }
    }

    if (uploadedFiles.length) {
      const images = [];

      for (const file of uploadedFiles) {
        try {
          if (file?.secure_url || file?.url || file?.path) {
            images.push(file.secure_url || file.url || file.path);
            continue;
          }

          if (file?.buffer) {
            const result = await uploadBufferToCloudinary(file.buffer, file.originalname || "banner");
            images.push(result?.secure_url || result?.url);
            continue;
          }

          if (file?.public_id) {
            const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
            images.push(cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload/${file.public_id}` : file.public_id);
          }
        } catch (error) {
          console.error("Banner upload error", error);
          return res.status(500).json({ message: error.message || "Cloudinary upload failed." });
        }
      }

      if (!images.length) {
        return res.status(400).json({ message: "No banner image was uploaded to Cloudinary." });
      }

      update.banner = {
        ...(update.banner || {}),
        image: images[0],
        images,
        slides: images.map((image, index) => ({ image, title: submittedSlides[index]?.title || "", subtitle: submittedSlides[index]?.subtitle || "" })),
      };
    }

    const settings = await SiteSettings.findOne() || new SiteSettings();
    ["banner", "about", "footer"].forEach((section) => {
      if (update[section]) settings[section] = { ...(settings[section]?.toObject ? settings[section].toObject() : settings[section] || {}), ...update[section] };
    });
    if (uploadedFiles.length) {
      settings.banner.image = update.banner.image;
      settings.banner.images = update.banner.images;
      settings.banner.slides = update.banner.slides;
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to save banner settings." });
  }
};

module.exports = { getSettings, updateSettings };
