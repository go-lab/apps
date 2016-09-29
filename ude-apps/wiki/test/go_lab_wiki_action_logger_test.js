import GoLabWikiActionLogger from 'app/go_lab_wiki_action_logger';

suite('GoLabWikiActionLogger', () => {
    var goLabActionLogger, logger, page, wikiPageId, pageAsAsObject;
    var assert = chai.assert;

    setup(() => {
        page = {
            id: '1',
            title: 'page title',
            currentRevision: { id: '0', content: 'some content' },
            isIndex: false,
        };
        pageAsAsObject = {
            objectType: 'wiki page',
            id: page.id,
            title: page.title,
            isIndex: page.isIndex,
            content: page.currentRevision.content,
            revisionId: page.currentRevision.id,
        };
        var metaDataHandler = new golab.ils.metadata.MetadataHandler({
            generator: {}
        });
        goLabActionLogger   = new ut.commons.actionlogging.ActionLogger(metaDataHandler);
        logger              = GoLabWikiActionLogger(goLabActionLogger);
        var wikiPageId = 'wiki-' + Math.random();
        sinon.spy(goLabActionLogger, 'logAccess');
        sinon.spy(goLabActionLogger, 'logAdd');
        sinon.spy(goLabActionLogger, 'logChange');
    });

    test('logAccessIndex', () => {
        return logger.logAccessIndex().then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'page',
                id: 'index',
            });
        });
    });

    test('logAccessView', () => {
        return logger.logAccessView(wikiPageId).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'page',
                id: 'view',
                wikiPageId,
            });
        });
    });

    test('logAccessEdit', () => {
        return logger.logAccessEdit(wikiPageId).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'page',
                id: 'edit',
                wikiPageId,
            });
        });
    });

    test('logAccessNew', () => {
        return logger.logAccessNew().then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'page',
                id: 'new',
            });
        });
    });

    test('logAccessRevisions', () => {
        return logger.logAccessRevisions(wikiPageId).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'page',
                id: 'revisions',
                wikiPageId,
            });
        });
    });

    test('logAccessRevisionComparison', () => {
        var revisionId = 'revision-' + Math.random();
        return logger.logAccessRevisionComparison(wikiPageId, revisionId).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'page',
                id: 'revision_comparison',
                wikiPageId,
                revisionId,
            });
        });
    });

    test('logAccessResourceRecommendations', () => {
        var wikiPageId = 'wiki-' + Math.random();
        return logger.logAccessResourceRecommendations(wikiPageId).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'page',
                id: 'resource_recommendations',
                wikiPageId,
            });
        });
    });

    test('logAccessRecommendedResource', function() {
        var resource = {
            url: 'http://' + Math.random(),
            title: 'Title ' + Math.random()
        };

        return logger.logAccessRecommendedResource(wikiPageId, resource).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAccess, {
                objectType: 'resource recommendation',
                url: resource.url,
                title: resource.title,
                wikiPageId,
            });
        });
    });

    test('logAddPage', () => {
        return logger.logAddPage(page).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logAdd, pageAsAsObject);
        });
    });

    test('logChangePage', () => {
        return logger.logChangePage(page).then(() => {
            sinon.assert.calledWith(goLabActionLogger.logChange, pageAsAsObject);
        });
    });
});
