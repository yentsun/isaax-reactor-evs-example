const stan = require('node-nats-streaming').connect('test-cluster', 'subscriber');
const Reactor = require('isaax-reactor');
const express = require('express');
const pack = require('./package.json');


const reactor = new Reactor('evs');
let c;
const app = express();

stan.on('error', (error) => {
   console.log(error.message);
   process.exit(1);
});

reactor.on('config', (config, done) => {
    config.pack = pack;
    c = config;
    reactor.set('store', {list: [], ids: {}, total: 0});
    stan.on('connect', () => {
        reactor.set('stan', stan);
        done();
    });

});

reactor.on('ready', () => {
    const store = reactor.get('store');
    app.get('/', function (req, res) {
        res.json({total: store.total, list: store.list});
    });
    app.get('/:id', function (req, res) {
        const {id} = req.params;
        res.json(store.ids[id]);
    });
    app.listen(reactor.config.http.port, function () {
        console.log('http listening on', reactor.config.http.port)
    });


    console.log(`************************************************************************`);
    console.log(`  ${c.pack.name}@${c.pack.version} ready [${c.environment}]`);
    console.log(`************************************************************************`);
});
