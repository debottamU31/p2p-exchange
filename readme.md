# P2P Distributed Exchange

This project implements a simplified P2P (peer-to-peer) distributed exchange using Node.js and the Grenache library. Each client has its own instance of the order book, can submit orders, and distribute them to other clients in the network.

## Project Structure
```
p2p-exchange/
├── src/
│ ├── factory/
│ │ ├── OrderBookFactory.js
│ ├── models/
│ │ ├── OrderBook.js
│ ├── services/
│ │ ├── ClientService.js
│ │ ├── ServerService.js
│ ├── index.js
├── package.json
```
## Explanation

### OrderBook Class

The `OrderBook` class manages the list of orders for each client. It includes methods to add orders, match orders, and handle locking to prevent race conditions. Each client uses its own instance of this class to manage its orders.

### OrderBookFactory Class

The `OrderBookFactory` class is responsible for creating instances of the `OrderBook`. This ensures that each client gets its own separate instance of the order book.

### ServerService Class

The `ServerService` class represents a server that manages its own `OrderBook`. When the server receives an order, it processes it using its own order book. This class sets up a Grenache RPC server to handle incoming requests and process orders.

### ClientService Class

The `ClientService` class handles the client-side operations. It interacts with the server to submit orders and distribute them to other clients in the network. This class sets up a Grenache RPC client to send requests to the server and other peers.

### Main Script

The `index.js` script initializes multiple servers and clients, each with its own order book. It demonstrates how to submit and distribute orders among clients.

## P2P Flow

1. **Initialization**:
   - Multiple server instances are initialized, each with its own `OrderBook`.
   - Multiple client instances are initialized, each with its own `ClientService`.

2. **Order Submission**:
   - A client creates an order and calls `submitOrder` to submit it to its local order book.
   - The order is processed by the client's corresponding server, which attempts to match the order with existing orders in its order book.
   - If there are any remaining quantities after matching, they are added back to the order book.

3. **Order Distribution**:
   - After submitting an order to its local order book, the client calls `distributeOrder` to propagate the order to other clients in the network.
   - The method uses the DHT (Distributed Hash Table) network to discover other peers.
   - The new order is sent to each discovered peer using an RPC (Remote Procedure Call) request.
   - Each peer processes the received order by calling its own `submitOrder` method to attempt matching and handling the order locally.

## How It Is P2P

- **Decentralization**: Each client acts as both a server and a client. It maintains its own order book and communicates with other clients without relying on a central server.
- **Direct Communication**: Clients communicate directly with each other to exchange orders using the Grenache library, which leverages a DHT for peer discovery.
- **Scalability**: The system can scale horizontally by adding more clients. Each client operates independently but collaborates with others to maintain the overall functionality of the exchange.

## How to Run

1. **Install Dependencies**:

    ```sh
    npm install
    npm i -g grenache-grape

    ```

2. **Start Grape Servers**:

    ```sh
    grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
    grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
    ```

3. **Run the Main Script**:

    ```sh
    node src/index.js
    ```

This setup ensures that each client has its own instance of the order book, can submit orders, and distribute them to other clients in the network. The use of factory and singleton patterns aligns with SOLID principles to create a scalable and maintainable codebase.

### Improvements / Limitations
1. **Server Availability**:
   - Currently, the client uses a timeout to delay interactions. There is no mechanism to check the availability of servers before submitting or distributing orders.
  
2. **Optimized Order Matching**:
   - Improve the order matching algorithm to handle larger datasets efficiently. Consider using data structures like binary search trees or heaps to optimize matching operations.

3. **Concurrency Handling**:
   - The current locking mechanism is basic and might not handle high concurrency efficiently.


