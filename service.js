const {parallel} = require('async');
const NATSSreaming = require('node-nats-streaming');
const {MongoClient} = require('mongodb');
const series = require('async/parallel');
const Reactor = require('isaax-reactor');
const pack = require('./package.json');


const reactor = new Reactor('evs-projects', {}, pack);

reactor.on('config', (config, done) => {

    series([

        function mongoConnectAndClean(done) {
            MongoClient.connect(config.mongodb.url, (error, db) => {
                if (!error) console.log('  > connected to mongodb', config.mongodb.url);
                const ids = db.collection('ids');
                const pages = db.collection('pages');
                parallel([
                    (done) => {ids.drop(done);},
                    (done) => {pages.drop(done);}
                ], (error) => {
                        done(error, db);
                    }
                );
            });
        },

        function stanConnect(done) {
            const stan = NATSSreaming.connect(config.nats.cluster, 'subscriber');
            stan.on('error', (error) => {
                return done(error);
            });
            stan.on('connect', () => {
                console.log('  > connected to stan');
                done(null, stan);
            });
        }

    ], (error, [db, stan]) => {

        if (error) {
            console.log(error.message);
            done(error);
            process.exit(1);
        }

        reactor.set('db', db);
        reactor.set('stan', stan);
        done();
    });

});
