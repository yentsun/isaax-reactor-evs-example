module.exports = (reactor, logger) => {

    return (seq, loggedAt, projectData, done=()=>{}) => {
        const store = reactor.get('store');
        projectData.title = `Title #${projectData.id}`;
        projectData.seq = seq;
        projectData.loggedAt = loggedAt;
        store.list.push(projectData.id);
        store.total++;
        store.ids[projectData.id] = projectData;
        logger.debug(projectData);
        done();
    }

};