module.exports = (reactor, logger) => {
    const nats = reactor.get('nats');
    nats.process('generic.command', (payload) => {
        logger.debug(payload);

    });
};