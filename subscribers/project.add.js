module.exports = (reactor, logger) => {
    const stan = reactor.get('stan');
    const store = reactor.get('store');
    const project = reactor.module('project');
    const opts = stan.subscriptionOptions().setDeliverAllAvailable();
    const sub = stan.subscribe('project.add', opts);
    sub.on('message', (msg) => {
        logger.debug('got message', msg);
        const seq = msg.getSequence();
        project.add(seq, JSON.parse(msg.getData()), () => {
            console.log(msg.getTimestamp(), store.list.length);
        });
    });
};
