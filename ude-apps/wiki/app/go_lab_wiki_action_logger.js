import { p, o } from 'app/util';

// note that the have an async interface to be future-proof

export default function GoLabWikiActionLogger(goLabActionLogger) {
    return {
        logAccessIndex, logAccessView, logAccessEdit, logAccessNew,
        logAccessRevisions, logAccessRevisionComparison,
        logAccessResourceRecommendations, logAddPage, logChangePage,
        logAccessRecommendedResource,
    };

    function logAccessIndex() {
        logAccessPage('index');
        return p.resolve();
    }

    function logAccessView(wikiPageId) {
        logAccessPage('view', { wikiPageId });
        return p.resolve();
    }

    function logAccessEdit(wikiPageId) {
        logAccessPage('edit', { wikiPageId });
        return p.resolve();
    }

    function logAccessNew() {
        logAccessPage('new');
        return p.resolve();
    }

    function logAccessRevisions(wikiPageId) {
        logAccessPage('revisions', { wikiPageId });
        return p.resolve();
    }

    function logAccessRevisionComparison(wikiPageId, revisionId) {
        logAccessPage('revision_comparison', { wikiPageId, revisionId });
        return p.resolve();
    }

    function logAccessResourceRecommendations(wikiPageId) {
        logAccessPage('resource_recommendations', { wikiPageId });
        return p.resolve();
    }

    function logAccessRecommendedResource(wikiPageId, resource) {
        goLabActionLogger.logAccess({
            objectType: 'resource recommendation',
            wikiPageId,
            url: resource.url,
            title: resource.title
        });
        return p.resolve();
    }

    function logAccessPage(pageId, extraObjectProperties) {
        var objectProperties = o.extend({
            objectType: 'page',
            id: pageId,
        }, extraObjectProperties);
        goLabActionLogger.logAccess(objectProperties);
        return p.resolve();
    }

    function logAddPage(page) {
        goLabActionLogger.logAdd(pageToASObject(page));
        return p.resolve();
    }

    function logChangePage(page) {
        goLabActionLogger.logChange(pageToASObject(page));
        return p.resolve();
    }

    function pageToASObject(page) {
        return {
            objectType: 'wiki page',
            id: page.id,
            isIndex: page.isIndex,
            title: page.title,
            content: page.currentRevision.content,
            revisionId: page.currentRevision.id,
        };
    }
}
