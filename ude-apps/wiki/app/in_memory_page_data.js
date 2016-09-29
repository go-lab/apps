import PageDataError from 'app/page_data_error';
import * as util from 'app/util';

export function InMemoryPageData(pages = []) {
    function getPages() {
        return Promise.resolve(pages);
    }

    function getPage(id) {
        var actualPage;
        var pageExists = pages.some(function(page) {
            actualPage = page;
            return page.id === id;
        });

        if (! pageExists) {
            return Promise.reject(new PageDataError(`No page found with id ${id}.`));
        }

        return Promise.resolve(actualPage);
    }

    function newPage(page) {
        var revision = {
            id: '0',
            content: page.content,
            author: page.author,
            timestamp: page.timestamp,
        };
        page = {
            id: pages.length.toString(),
            isIndex: page.isIndex || false,
            title: page.title,
            currentRevision: revision,
            revisions: [revision],
        };

        pages.push(page);

        return Promise.resolve(page);
    }

    function newRevision(id, revision) {
        return getPage(id).then(function(page) {
            var rev = util.o.clone(revision);
            rev.id = page.revisions.length.toString();
            page.currentRevision = rev;
            page.revisions.unshift(rev);
            return rev;
        });
    }

    return { getPages, getPage, newPage, newRevision };
}

export default InMemoryPageData;
