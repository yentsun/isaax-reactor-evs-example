module.exports = (reactor, logger) => {

    return (seq, projectData, done=()=>{}) => {
        const store = reactor.get('store');
        projectData.title = `Title #${projectData.id}`;
        projectData.seq = seq;
        store.list.push(projectData.id);
        store.total++;
        store.ids[projectData.id] = projectData;
        logger.debug(projectData);
        done();
    }

};