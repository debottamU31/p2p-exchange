const OrderBook = require('../models/OrderBook');

class OrderBookFactory {
  static createOrderBook() {
    return OrderBook.getInstance();
  }
}

module.exports = OrderBookFactory;