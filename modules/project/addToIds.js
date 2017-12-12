module.exports = (reactor, logger) => {

    return (projectData, done=()=>{}) => {
        const db = reactor.get('db');
        const ids = db.collection('ids');
        logger.debug(projectData);
        ids.insertOne(projectData, done);
    }
};
