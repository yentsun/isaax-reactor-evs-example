const Reactor = require('isaax-reactor');
const stan = require('node-nats-streaming').connect('test-cluster', 'subscriber');
const pack = require('./package.json');



const reactor = new Reactor('evs');
let c;

stan.on('error', (error) => {
   console.log(error.message);
   process.exit(1);
});

reactor.on('config', (config, done) => {
    config.pack = pack;
    c = config;
    stan.on('connect', () => {
        reactor.set('stan', stan);
        done();
    });

});

reactor.on('ready', () => {
    console.log(`************************************************************************`);
    console.log(`  ${c.pack.name}@${c.pack.version} ready [${c.environment}]`);
    console.log(`************************************************************************`);
});
