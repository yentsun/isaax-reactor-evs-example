const {series} = require('async');
const {PassThrough, Writable} = require('stream');

module.exports = (reactor, logger) => {
    const stan = reactor.get('stan');
    const project = reactor.module('project');
    const opts = stan.subscriptionOptions().setDeliverAllAvailable();
    const sub = stan.subscribe('project.add', opts);
    const queueStream = new PassThrough();
    const storeWritable = new Writable({
        write(newProjectString, encoding, done) {
            const newProject = JSON.parse(newProjectString);
            series([

                function addProject(done) {
                    project.add(newProject, done);
                },

                function addProjectToPages(done) {
                    project.addToPages(newProject, done);
                }

            ], done);
        }
    });
    queueStream.pipe(storeWritable);

    sub.on('message', (msg) => {
        const newProject = JSON.parse(msg.getData());
        const seq = msg.getSequence();
        logger.debug('got project data', newProject, seq);
        newProject.title = `Title #${newProject.id}`;
        newProject.loggedAt = msg.getTimestamp();
        queueStream.push(JSON.stringify(newProject));
    });
};
