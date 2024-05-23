class OrderBook {
    constructor() {
      this.orders = [];
      this.locked = false;
    }
  
    async addOrder(order) {
      await this.acquireLock();
      this.orders.push(order);
      this.releaseLock();
    }
  
    async matchOrder(newOrder) {
      await this.acquireLock();
      let matchedOrders = [];
      let remainingQuantity = newOrder.quantity;
  
      for (let i = 0; i < this.orders.length; i++) {
        let order = this.orders[i];
  
        if (order.type !== newOrder.type && order.price === newOrder.price) {
          let matchQuantity = Math.min(order.quantity, remainingQuantity);
          remainingQuantity -= matchQuantity;
          order.quantity -= matchQuantity;
          matchedOrders.push({ ...order, quantity: matchQuantity });
  
          if (order.quantity === 0) {
            this.orders.splice(i, 1);
            i--; // adjust index after removal
          }
  
          if (remainingQuantity === 0) {
            break;
          }
        }
      }
  
      this.releaseLock();
  
      return {
        matchedOrders,
        remainingOrder: remainingQuantity > 0 ? { ...newOrder, quantity: remainingQuantity } : null
      };
    }
  
    async acquireLock() {
      while (this.locked) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before retrying
      }
      this.locked = true;
    }
  
    releaseLock() {
      this.locked = false;
    }
  
    static getInstance() {
      if (!OrderBook.instance) {
        OrderBook.instance = new OrderBook();
      }
      return OrderBook.instance;
    }
  }
  
  module.exports = OrderBook;