const { PeerRPCServer } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");
const OrderBookFactory = require("../factory/OrderBookFactory");

class ServerService {
  constructor(grapeAddress, port) {
    this.port = port

    this.link = new Link({ grape: grapeAddress });
    this.link.start();

    this.peerServer = new PeerRPCServer(this.link, { timeout: 300000 });
    this.peerServer.init();

    this.service = this.peerServer.transport("server");
    this.service.listen(this.port);

    this.orderBook = OrderBookFactory.createOrderBook();

    setInterval(this.announce.bind(this), 1000);

    this.service.on("request", async (rid, key, payload, handler) => {
      if (payload.type === "submitOrder") {
        try {
          let result = await this.orderBook.matchOrder(payload.order);
          if (result.remainingOrder) {
            await this.orderBook.addOrder(result.remainingOrder);
          }
          handler.reply(null, result);
        } catch (err) {
          handler.reply(err);
        }
      }
    });
  }

  announce() {
    this.link.announce("orderbook", this.service.port, {}, (err) => {
      if (err) {
        console.error('Error Service Announces', err);
        process.exit(err.code || -1)
      };
    });
  }
}

module.exports = ServerService;
