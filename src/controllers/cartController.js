const Cart = require("../models/Cart");

const getUserCart = async (userId) => {
  return Cart.find({ user: userId }).populate("product");
};

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const existingItem = await Cart.findOne({
      user: req.user._id,
      product: req.body.product,
    });

    if (existingItem) {
      existingItem.quantity += req.body.quantity || 1;
      await existingItem.save();
    } else {
      await Cart.create({
        user: req.user._id,
        product: req.body.product,
        quantity: req.body.quantity || 1,
      });
    }

    const cartItems = await getUserCart(req.user._id);
    res.status(201).json(cartItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in user's cart
const getCart = async (req, res) => {
  try {
    const cartItems = await getUserCart(req.user._id);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity <= 0) {
      await cartItem.deleteOne();
    } else {
      cartItem.quantity = quantity;
      await cartItem.save();
    }

    const cartItems = await getUserCart(req.user._id);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.deleteOne();
    const cartItems = await getUserCart(req.user._id);
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};