import { p }                 from 'app/util';
import { makeDomTemplating } from 'app/templating';
import { pagesFixture }      from 'test/helper';
import PageData              from 'app/in_memory_page_data';
import EditPage              from 'app/edit_page';

suite('EditPage', () => {
    var assert = chai.assert;
    var page, pages, pageData, templating, document, redirect, clock,
        actionLogger;

    setup(() => {
        fixtures.load('edit_page_fixture.html');
        document = fixtures.window().document;
        templating = makeDomTemplating(document.querySelector('#target'), document);
        redirect = sinon.spy();

        var nowDate = new Date();
        clock = { now: () => nowDate };

        pages = pagesFixture();
        page = pages[0];
        pageData = PageData([page]);
        actionLogger = {
            logChangePage: sinon.stub().returns(p.resolve()),
        };

        sinon.spy(templating, 'render');
        sinon.spy(pageData, 'newRevision');

        return EditPage(templating, pageData, actionLogger, clock)
            .editExistingPage(page, pages, author, redirect);
    });

    teardown(() => {
        fixtures.cleanUp();
    });

    test('renders edit template', () => {
        var args = templating.render.firstCall.args;
        assert.equal(args[0], 'edit');
        assert.equal(args[1].page, page);
    });

    suite('form', () => {
        var form, textarea, saveButton, setContent;

        setup(() => {
            form = document.querySelector('#edit_page');
            textarea = form.querySelector('textarea');
            saveButton = form.querySelector('button[type="submit"]');
            var event = new Event('input');
            setContent = (content) => {
                textarea.value = content;
                textarea.dispatchEvent(event);
            };
        });

        test('save button is enabled when there is content from the start', (done) => {
            setTimeout(() => {
                assert.isFalse(saveButton.disabled);
                done();
            }, 0);
        });

        test('save button is disabled when no content is filled in', (done) => {
            setContent('');
            setContent('Bla');
            setContent('     ');
            setTimeout(() => {
                assert.isTrue(saveButton.disabled);
                done();
            }, 0);
        });

        test('save button is enabled when content is filled in', (done) => {
            setContent('');
            setContent('Bla');
            setTimeout(() => {
                assert.isFalse(saveButton.disabled);
                done();
            }, 0);
        });

        suite('after submit', () => {
            var submit;

            setup(() => {
                // not using form.submit() because it doesn't trigger submit event
                submit = (cb) => {
                    // iframe must be visible because firefox doesn't allow clicks otherwise
                    window.document.querySelector('iframe').style.display = 'block';
                    setTimeout(() => {
                        saveButton.click();
                        setTimeout(() => cb(), 0);
                    }, 0);
                };
            });

            test('sets new page content when form is submitted', (done) => {
                var content = 'Hallo.';
                textarea.value = content;
                var revision = {
                    timestamp: clock.now(),
                    content: content,
                };
                submit(() => {
                    assert.deepEqual(pageData.newRevision.args[0], [page.id, revision]);
                    done();
                });
            });

            test('redirects to view page', (done) => {
                submit(() => {
                    assert.isTrue(redirect.calledWith('view', { pageId: page.id }));
                    done();
                });
            });

            test('logs "user add revision"', (done) => {
                submit(() => {
                    assert.isTrue(actionLogger.logChangePage.calledWith(page));
                    done();
                });
            });

        });

        suite('link to wiki page', () => {
            test('inserts link at cursor position', () => {
                var previousTextStart = 'Link: ';
                textarea.value = previousTextStart + '!';
                textarea.selectionStart = textarea.selectionEnd = 6;
                var link = $(document).find('.pages_display a:first-child');
                // [Page name](wiki:123 "Page name")
                var linkText = `[${link.html()}](wiki:${link.data('id')} "${link.html()}")`;
                link.click();
                assert.equal(textarea.value, previousTextStart + linkText + '!');
            });

            // TODO
            test('replaces selection with link');
        });
    });
});
