import { o, p }         from 'app/util';
import PageDataError    from 'app/page_data_error';
import InMemoryPageData from 'app/in_memory_page_data';
import GoLabPageData    from 'app/go_lab_page_data';
import { pagesFixture } from 'test/helper';

suite('PageData', function() {
    pageDataTests(InMemoryPageData);
    pageDataTests(GoLabPageData, setUpGoLabPageData);
});

function pageDataTests(PageData, createPageData) {
    suite(PageData.name, () => {
        var assert = chai.assert;
        var pageData, pages, vars = {};

        setup(() => {
            pages = pagesFixture();
            if (createPageData !== undefined) {
                vars = createPageData(pages);
                pageData = vars.pageData;
            } else {
                pageData = PageData(pagesFixture());
            }
        });

        if (PageData.name === 'GoLabPageData') {
            var assertError = (storageHandler, resourceType, errorMessage) =>
                assert.throws(() => PageData(storageHandler, resourceType),
                              errorMessage);

            var typeErrorMessage = (what, expectedType, actualType) =>
                `GoLabPageData: Needs a ${what} of type "${expectedType}" (was: "${actualType}").`;

            suite('instantiation', () => {
                test('throws error if no storage handler is given', () => {
                    return p.all([
                        assertError(undefined, '', typeErrorMessage(
                            'GoLab Storage handler', 'object', 'undefined')),
                        assertError('', '', typeErrorMessage(
                            'GoLab Storage handler', 'object', 'string')),
                    ]);
                });
            });
        }

        suite('getPages', () => {
            test('returns all pages', () => {
                return pageData.getPages().then((actualPages) => {
                    assert.deepEqual(actualPages, pages);
                });
            });

            // TODO test error case
        });

        suite('getPage', () => {
            test('getting a page by its id', () => {
                var page = pages[0];
                return assert.becomes(pageData.getPage(page.id), page);
            });

            test('throws PageDataError when no page found', () => {
                var id = 123;
                return assert.isRejected(pageData.getPage(id),
                                         new RegExp(`No page found with id ${id}.`));
            });
        });

        suite('newPage', () => {
            var newPage, actualPage;
            setup(() => {
                newPage = {
                    title: 'Da Page',
                    author: 'Tester Testerson',
                    content: 'I am a test!',
                    timestamp: new Date(),
                };
                return pageData.newPage(newPage).then(function(page) {
                    actualPage = page;
                });
            });

            test('returns a new page', () => {
                var currentRevision = {
                    id: '0',
                    content: newPage.content,
                    author: newPage.author,
                    timestamp: newPage.timestamp,
                };

                var expectedPage = {
                    id: '2',
                    isIndex: false,
                    title: newPage.title,
                    currentRevision: currentRevision,
                    revisions: [currentRevision],
                };

                assert.deepEqual(actualPage, expectedPage);
            });

            test('saves a new page', () => {
                return assert.becomes(pageData.getPage(actualPage.id), actualPage);
            });

            test('can declare pages as index page', function() {
                newPage.isIndex = true;
                return pageData.newPage(newPage).then((indexPage) => {
                    assert.isTrue(indexPage.isIndex);
                });
            });

            // TODO test error case
        });

        suite('newRevision', () => {
            var pageId, page, newRevision, currentRevision, revisions, returnedRevision;

            setup(() => {
                pageId = '1';
                newRevision = {
                    content: 'This is new content',
                    timestamp: new Date(),
                    author: 'Max Meyer',
                };

                return pageData.newRevision(pageId, newRevision).then(function(rev) {
                    returnedRevision = rev;
                    return pageData.getPage(pageId);
                }).then(function(page) {
                    revisions        = page.revisions;
                    currentRevision  = page.currentRevision;
                });
            });

            test('setting the current revision to one with new properties,', () => {
                assert.propertyVal(currentRevision, 'id', '2');
                assert.propertyVal(currentRevision, 'content', newRevision.content);
                assert.propertyVal(currentRevision, 'author', newRevision.author);
                assert.equal(currentRevision.timestamp.getTime(),
                             newRevision.timestamp.getTime());
            });

            test('returns the new revision', () => {
                assert.deepEqual(returnedRevision, currentRevision);
            });

            test('adding the new revision to the list of revisions', () => {
                assert.lengthOf(revisions, 3);
            });

            test('the new revision is the first of all revisions', () => {
                assert.deepEqual(revisions[0], currentRevision);
            });

            // TODO test error case
        });
    });
}

class GoLabStorageHandler {
    constructor(resourceType) {
        this._store = {};
        this._nextId = 0;
        this._resourceType = resourceType;
    }

    readResource(id, cb) {
        var r = this._store[id];
        if (r === undefined) cb(new Error());
        else cb(null, JSON.parse(JSON.stringify(r)));
    }

    resourceExists(id, cb) {
        cb(null, this._store[id] !== undefined);
    }

    createResource(object, cb) {
        var id = this._nextId.toString();
        this._nextId++;
        var resource = makeGoLabResource(id, object, this._resourceType);
        this._store[id] = resource;
        this.readResource(id, cb);
    }

    updateResource(id, object, cb) {
        this._store[id].content = object;
        this.readResource(id, cb);
    }

    listResourceMetaDatas(cb) {
        this.listResourceIds((err, ids) => cb(null, ids.map((id) => ({ metadata: { id } }))));
    }

    listResourceIds(cb) {
        cb(null, Object.keys(this._store));
    }
}

function makeGoLabResource(id, content, resourceType) {
    return {
        content: content,
        metadata: {
            target: { objectType: resourceType },
            id: id,
        },
    };
}

function setUpGoLabPageData(data, resourceType='wiki-' + Math.random().toString()) {
    var storageHandler = new GoLabStorageHandler(resourceType);

    storageHandler._store = data.reduce(function(obj, page) {
        obj[page.id] = makeGoLabResource(page.id, page, resourceType);
        storageHandler._nextId++;
        return obj;
    }, {});

    var pageData = GoLabPageData(storageHandler, resourceType);

    return { pageData, storageHandler };
}
