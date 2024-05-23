/**
 * Boilerplate scripts to check connection and basic feature
 * you can ignore this and read through readme
 */

const {PeerRPCClient} = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

peer.request('order_rpc_1', { msg: 'hello' }, { timeout: 30000 }, (err, data) => {
    if(err) console.log('Client Error', err)
    console.log('Client => order_rpc_1 =>', data)
})