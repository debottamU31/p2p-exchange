/**
 * Boilerplate scripts to check connection and basic feature
 * you can ignore this and read through readme
 */


const { PeerRPCServer } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')


const link = new Link({
    grape: 'http://127.0.0.1:30001'
})

link.start()

const peer = new PeerRPCServer(link, {
    timeout: 300000
})

peer.init()

const port  = 1024 + Math.floor(Math.random() * 1000)
const service = peer.transport('server')

service.listen(port)


setInterval(() => {
    link.announce('order_rpc_1', service.port, {})
    
}, 1000)

service.on('request', (rid, key, payload, handler) => {
    console.log('order_rpc_1', { 
        rid,
        key,
        payload,
        handler
    })
    handler.reply(null, {
        msg: 'I am awesome'
    })
})