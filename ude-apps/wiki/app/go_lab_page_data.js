import { p, o }       from 'app/util';
import PageDataError  from 'app/page_data_error';
import NamedTypeError from 'app/named_type_error';

function assertType(value, expectedType, name) {
    if (typeof value !== expectedType) {
        throw new NamedTypeError('GoLabPageData', name, expectedType, value);
    }
}

export default function GoLabPageData(_storageHandler) {
    assertType(_storageHandler, 'object', 'GoLab Storage handler');

    var storageHandler = p.promisifyObject(_storageHandler, [
        'readResource',
        'createResource',
        'updateResource',
        'listResourceMetaDatas',
        'resourceExists'
    ]);

    return { getPages, getPage, newPage, newRevision };

    function getPages() {
        return storageHandler.listResourceMetaDatas()
            .map(resource => resource.metadata.id)
            .then(getPagesForIds)
            .then(filterOutInvalidPages);
    }

    function getPage(id) {
        return storageHandler.resourceExists(id).then((exists) => {
            if (! exists) {
                throw new PageDataError(`No page found with id ${id}.`);
            }
            return storageHandler.readResource(id);
        }).then(makePageFromResource);
    }

    function newPage(page) {
        var revision = {
            id: '0',
            content: page.content,
            author: page.author,
            timestamp: page.timestamp,
        };

        page = {
            title: page.title,
            isIndex: page.isIndex || false,
            currentRevision: revision,
            revisions: [revision],
            author: page.author,
        };

        return storageHandler.createResource(page).then(makePageFromResource);
    }

    function newRevision(id, revision) {
        return getPage(id).then(function(page) {
            var rev = o.clone(revision);
            rev.id = page.revisions.length.toString();
            page.currentRevision = rev;
            page.revisions.unshift(rev);
            return storageHandler.updateResource(id, page).return(rev);
        });
    }

    function makePageFromResource(resource) {
        var page = resource.content;
        page.id = resource.metadata.id;
        page.currentRevision.timestamp = new Date(page.currentRevision.timestamp);
        page.author = page.author || 'unknown author';
        page.currentRevision.author = page.currentRevision.author || 'unknown author';
        page.revisions.forEach((r) => {
            r.timestamp = new Date(r.timestamp);
            r.author = r.author || 'unknown author';
        });
        return page;
    }

    function getPagesForIds(ids) {
        return p.all(ids.map((id) => getPage(id)));
    }

    function filterOutInvalidPages(pages) {
        return pages.filter((page) => ! page.invalidPage);
    }
}
