'use strict';

const { PeerRPCClient } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

class ClientService {
  constructor(grapeAddress) {
    this.link = new Link({ grape: grapeAddress });
    this.link.start();

    this.peerClient = new PeerRPCClient(this.link, {});
    this.peerClient.init();
  }

  submitOrder(order) {
    this.peerClient.request('orderbook', { type: 'submitOrder', order }, { timeout: 300000 }, (err, result) => {
      if (err) {
        console.log(err)
      }
      console.log('Matched Orders:', result.matchedOrders);
      console.log('Remaining Order:', result.remainingOrder);
    });
  }

  distributeOrder(order) {
    this.link.lookup('orderbook', (err, peers) => {
      if (err) {
        console.log(err)
        process.exit(-1)
      };

      peers.forEach(peer => {
        this.peerClient.request('orderbook', { type: 'submitOrder', order }, { timeout: 30000 }, (err, result) => {
          if (err) throw err;
          console.log(`Order sent to ${peer}`);
          console.log('Matched Orders:', result.matchedOrders);
          console.log('Remaining Order:', result.remainingOrder);
        });
      });
    });
  }
}

module.exports = ClientService;