const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product Not Found",
    });
  }

  res.json(product);
};

const createProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    stock,
    brand,
    color,
    size,
    material,
    featured,
  } = req.body;

  const product = await Product.create({
    title,
    description,
    price: Number(price),
    category,
    stock: Number(stock || 0),
    brand,
    color,
    size,
    material,
    featured: featured === true || featured === "true",
    image: req.file ? req.file.path : "",
  });

  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product Not Found",
    });
  }

  product.title = req.body.title || product.title;
  product.description = req.body.description || product.description;
  product.price = req.body.price ? Number(req.body.price) : product.price;
  product.category = req.body.category || product.category;
  product.stock = req.body.stock ? Number(req.body.stock) : product.stock;
  product.brand = req.body.brand ?? product.brand;
  product.color = req.body.color ?? product.color;
  product.size = req.body.size ?? product.size;
  product.material = req.body.material ?? product.material;
  product.featured = req.body.featured === true || req.body.featured === "true" ? true : false;

  if (req.file) {
    product.image = req.file.path;
  }

  await product.save();

  res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product Not Found",
    });
  }

  await product.deleteOne();

  res.json({
    message: "Product Deleted Successfully",
  });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};