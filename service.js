const stan = require('node-nats-streaming').connect('test-cluster', 'subscriber');
const Reactor = require('isaax-reactor');
const express = require('express');
const pack = require('./package.json');


const reactor = new Reactor('evs', {}, pack);
const app = express();

stan.on('error', (error) => {
   console.log(error.message);
   process.exit(1);
});

reactor.on('config', (config, done) => {
    reactor.set('store', {list: [], ids: {}, total: 0});
    const store = reactor.get('store');
    app.get('/', function (req, res) {
        res.json({total: store.total, list: store.list});
    });
    app.get('/:id', function (req, res) {
        const {id} = req.params;
        res.json(store.ids[id]);
    });
    app.listen(reactor.config.http.port, function () {
        console.log('  > http listening on', reactor.config.http.port)
    });
    stan.on('connect', () => {
        console.log('  > connected to stan');
        reactor.set('stan', stan);
        done()
    });

});
