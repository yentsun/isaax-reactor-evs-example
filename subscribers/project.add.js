module.exports = (reactor, logger) => {
    const stan = reactor.get('stan');
    const opts = stan.subscriptionOptions().setDeliverAllAvailable();
    const sub = stan.subscribe('project.add', opts);
    sub.on('message', (msg) => {
        console.log('--->', msg.getData());
    });
};