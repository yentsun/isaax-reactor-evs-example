const Reactor = require('isaax-reactor');
const NATSWrapper = require('isaax-nats-js-wrapper');
const pack = require('./package.json');


const reactor = new Reactor('evs');
let c;

reactor.on('config', (config, done) => {
    config.pack = pack;
    c = config;
    reactor.set('nats', NATSWrapper(config.nats));
    done();
});

reactor.on('ready', () => {
    console.log(`************************************************************************`);
    console.log(`  ${c.pack.name}@${c.pack.version} ready [${c.environment}]`);
    console.log(`************************************************************************`);
});
