const cli = require('commander');
const NATSWrapper = require('isaax-nats-js-wrapper');


const nats = NATSWrapper();
cli
    .version('0.1.0')
    .command('query <subject> <payload>')
    .action(function(subject, payload) {
        console.log('>>> sending query', subject, payload);
        nats.publish(subject, payload);
    });

cli.parse(process.argv);
process.exit();
