const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema({
  banner: {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    slides: [{
      image: { type: String, default: "" },
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
    }],
  },
  about: {
    eyebrow: { type: String, default: "About LuxeCart" },
    title: { type: String, default: "Designed for effortless, modern shopping." },
    description: { type: String, default: "" },
    perkOne: { type: String, default: "" },
    perkTwo: { type: String, default: "" },
    perkThree: { type: String, default: "" },
    whyTitle: { type: String, default: "Why customers love us" },
    whyDescription: { type: String, default: "" },
  },
  footer: {
    brand: { type: String, default: "LuxeCart" },
    tagline: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
}, { timestamps: true });

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
