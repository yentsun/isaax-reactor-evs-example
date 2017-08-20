const cli = require('commander');
const stan = require('node-nats-streaming').connect('test-cluster', 'publisher');
const configLoader = require('ini-config');


configLoader('config.ini', (error, config) => {
    cli
        .version('0.1.0')
        .command('command <subject> <payload>')
        .action(function(subject, payload) {
            console.log('>>> sending command:', subject, payload);
            stan.publish(subject, payload, function(error, guid){
                if(error) {
                    console.log('publish failed: ' + error);
                } else {
                    console.log('published message with guid: ' + guid);
                    stan.close();
                }
            });

        });
    stan.on('connect', () => {
        cli.parse(process.argv);
    });
    stan.on('close', function() {
        process.exit();
    });
});
