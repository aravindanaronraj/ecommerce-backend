const Review = require("../models/Review");
const Product = require("../models/Product");

const getReviews = async (req, res) => {
  const filter = req.query.product ? { product: req.query.product } : { product: null };
  const reviews = await Review.find(filter).populate("user", "name").sort({ createdAt: -1 });
  res.json(reviews);
};

const createReview = async (req, res) => {
  const { product, rating, comment } = req.body;
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5 || !comment?.trim()) {
    return res.status(400).json({ message: "Please provide a rating from 1 to 5 and a review comment." });
  }
  if (product && !(await Product.exists({ _id: product }))) return res.status(404).json({ message: "Product not found." });

  const review = await Review.create({ user: req.user._id, product: product || null, rating: numericRating, comment: comment.trim() });
  await review.populate("user", "name");
  res.status(201).json(review);
};

module.exports = { getReviews, createReview };
