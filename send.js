const uuid = require('uuid');
const {times} = require('async');
const cli = require('commander');
const stan = require('node-nats-streaming').connect('test-cluster', 'publisher');
const configLoader = require('ini-config');


configLoader('config.ini', (error, config) => {
    cli
        .version('0.1.0')
        .command('add-project [number]')
        .action(function(number=1) {
            number = Number(number);
            const subject = 'project.add';
            times(number, (n, done) => {
                const id = uuid.v4();
                const payload = {id};
                console.log('>>> sending command:', subject, payload);
                stan.publish(subject, JSON.stringify(payload), function(error, guid){
                    if (error) {
                        done(error);
                    } else {
                        // console.log('published message with guid: ' + guid);
                        done();
                    }
                });
            }, (error) => {
                if (error) console.log('publish failed: ' + error);
                console.log('----done----');
                stan.close();
            });
        });
    stan.on('connect', () => {
        cli.parse(process.argv);
    });
    stan.on('close', function() {
        process.exit();
    });
});
