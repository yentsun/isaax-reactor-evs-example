const {waterfall} = require('async');


module.exports = (reactor, logger) => {

    return (projectData, done=()=>{}) => {
        // logger.debug(projectData);
        const {pagination} = reactor.config;
        const db = reactor.get('db');
        const pages = db.collection('pages');
        pages.findOne({$query:{}, $orderby:{$natural:-1}}, (error, lastPage) => {
            if (error) return done(error);
            logger.debug('last page is', lastPage);
            if (!lastPage) {
                logger.debug('no last page');
                pages.insertOne({number: 1, contents: [projectData]}, done);
            } else if (lastPage.contents.length < pagination.limit) {
                logger.debug('last page got space', lastPage.contents.length, pagination.limit);
                lastPage.contents.push(projectData);
                pages.save(lastPage, done);
            } else {
                logger.debug('last page got no space left', lastPage.contents.length, pagination.limit);
                pages.insertOne({number: lastPage.number + 1, contents: [projectData]}, done);
            }
        });


    }

};