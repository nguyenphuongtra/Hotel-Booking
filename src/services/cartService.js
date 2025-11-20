const Cart = require('../models/Cart');
const Room = require('../models/Room');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ userId }).populate('items.roomId');
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    return cart;
  }

  async addItem(userId, itemData) {
    const { roomId, checkInDate, checkOutDate, numberOfGuests } = itemData;

    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = room.pricePerNight * numberOfNights;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item =>
      item.roomId.toString() === roomId &&
      item.checkInDate.toDateString() === checkIn.toDateString() &&
      item.checkOutDate.toDateString() === checkOut.toDateString()
    );

    if (existingItem) {
      throw new Error('This room is already in your cart for these dates');
    }

    cart.items.push({
      roomId,
      roomName: room.name,
      roomType: room.type,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      pricePerNight: room.pricePerNight,
      numberOfNights,
      totalPrice
    });

    await cart.save();
    return cart;
  }

  async updateItem(userId, itemId, updates) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.id(itemId);
    if (!item) throw new Error('Item not found');

    if (updates.checkInDate || updates.checkOutDate) {
      const checkIn = new Date(updates.checkInDate || item.checkInDate);
      const checkOut = new Date(updates.checkOutDate || item.checkOutDate);
      const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      item.checkInDate = checkIn;
      item.checkOutDate = checkOut;
      item.numberOfNights = numberOfNights;
      item.totalPrice = item.pricePerNight * numberOfNights;
    }

    if (updates.numberOfGuests) {
      item.numberOfGuests = updates.numberOfGuests;
    }

    await cart.save();
    return cart;
  }

  async removeItem(userId, itemId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();
    return cart;
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    cart.items = [];
    await cart.save();
    return cart;
  }
}

module.exports = new CartService();
