const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, items: requestedItems } = req.body;
    const address = shippingAddress || req.user.shippingAddress;
    if (!address?.address || !address?.city || !address?.state || !address?.postalCode || !address?.phone) {
      return res.status(400).json({ message: "A complete shipping address is required" });
    }

    let cartItems = await Cart.find({ user: req.user._id }).populate("product");
    if (requestedItems?.length) {
      const productIds = requestedItems.map((item) => item.product);
      const products = await Product.find({ _id: { $in: productIds } });
      cartItems = requestedItems.map((item) => ({ product: products.find((product) => product._id.toString() === item.product), quantity: Number(item.quantity) || 1 }));
    }
    if (!cartItems.length) return res.status(400).json({ message: "Your cart is empty" });

    const unavailableItem = cartItems.find((item) => !item.product);
    if (unavailableItem) return res.status(400).json({ message: "A product in your cart is no longer available" });

    const items = cartItems.map((item) => ({ product: item.product._id, title: item.product.title, price: item.product.price, quantity: item.quantity }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ user: req.user._id, items, total, shippingAddress: address });
    req.user.shippingAddress = address;
    await req.user.save();
    await Cart.deleteMany({ user: req.user._id });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!statuses.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getMyOrders, updateOrderStatus };
