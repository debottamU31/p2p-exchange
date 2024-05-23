const ServerService = require("./services/ServerService");
const ClientService = require("./services/ClientService");
const wait = require("./utils");

const server1 = new ServerService("http://127.0.0.1:30001", 8084);
const server2 = new ServerService("http://127.0.0.1:30001", 8085);


/**
 * [TODO]
 * There should be a better implementation
 * How to wait for Servers to be connected
 * I could not figure out in local
 */

wait(3000).then(() => {
  const client1 = new ClientService("http://127.0.0.1:30001");
  const client2 = new ClientService("http://127.0.0.1:30001");

  const order1 = { type: "buy", quantity: 100, price: 10 };
  const order2 = { type: "sell", quantity: 50, price: 10 };

  client1.submitOrder(order1);
  client2.submitOrder(order2);

  client1.distributeOrder(order1);
  client2.distributeOrder(order2);
});

