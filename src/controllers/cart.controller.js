const cartService = require('../services/cartService');

exports.getCart = async (req, res) => {
  try {
    // Kiểm tra nếu req.user hoặc req.user.id không tồn tại
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'  // Thông báo khi không có user hoặc id
      });
    }

    const cart = await cartService.getCart(req.user.id);
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    // Log lỗi để debug dễ dàng hơn
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    // Kiểm tra nếu req.user hoặc req.user.id không tồn tại
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cart = await cartService.addItem(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    // Log lỗi để debug dễ dàng hơn
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Bad Request'
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    // Kiểm tra nếu req.user hoặc req.user.id không tồn tại
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cart = await cartService.updateItem(
      req.user.id,
      req.params.itemId,
      req.body
    );
    res.json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    // Log lỗi để debug dễ dàng hơn
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Bad Request'
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    // Kiểm tra nếu req.user hoặc req.user.id không tồn tại
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cart = await cartService.removeItem(req.user.id, req.params.itemId);
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    // Log lỗi để debug dễ dàng hơn
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Bad Request'
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    // Kiểm tra nếu req.user hoặc req.user.id không tồn tại
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const cart = await cartService.clearCart(req.user.id);
    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    // Log lỗi để debug dễ dàng hơn
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Bad Request'
    });
  }
};
