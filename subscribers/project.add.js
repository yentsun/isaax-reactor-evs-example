module.exports = (reactor, logger) => {
    const stan = reactor.get('stan');
    const project = reactor.module('project');
    const opts = stan.subscriptionOptions().setDeliverAllAvailable();
    const sub = stan.subscribe('project.add', opts);
    sub.on('message', (msg) => {
        logger.debug('got message', msg);
        const seq = msg.getSequence();
        const loggedAt = msg.getTimestamp();
        project.add(seq, loggedAt, JSON.parse(msg.getData()));
    });
};
