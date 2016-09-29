import { p }                  from 'app/util';
import { Router, RouteError } from 'app/router';

suite('Router', () => {
    var assert = chai.assert;
    var window;
    var requestHandlers;
    var router;

    setup(() => {
        window = windowStub();
        requestHandlers = {
            index: sinon.spy(),
            page: sinon.spy(),
        };
        router = Router(window);
    });

    suite('basic routing', () => {
        test('routing to index by default', () => {
            setRouting(requestHandlers);
            assert.isTrue(requestHandlers.index.called);
        });

        test('calling the route corresponding to location.hash', () => {
            window.location.hash = '#page';
            setRouting(requestHandlers);
            assert.isTrue(requestHandlers.page.called);
        });

        test('calling a route when location.hash changes', () => {
            setRouting(requestHandlers);
            window.location.hash = '#page';
            assert.isTrue(requestHandlers.page.called);
        });

        test('calling index request handler when route changes to index route', () => {
            setRouting(requestHandlers);
            window.location.hash = '#page';
            window.location.hash = '';
            assert.isTrue(requestHandlers.index.called);
        });

        test('throws an error if a request handler for a route does not exist', () => {
            window.location.hash = '#page';
            assert.throw(() => {
                setRouting({});
            }, RouteError, 'There is no request handler for route "page".');
        });
    });

    suite('async route handlers', () => {
        test('allows generator functions that yield promises', function() {
            var promise = sinon.stub().returns(p.resolve());
            requestHandlers.page = function* () {
                yield promise();
            };
            window.location.hash = '#page';
            setRouting(requestHandlers);
            assert.isTrue(promise.called);
        });
    });

    suite('query parameter', () => {
        test('no parameters', () => {
            setRouting(requestHandlers);
            assert.isTrue(requestHandlers.index.calledWith({}));
        });

        test('a route receives a query parameter', () => {
            window.location.hash = '#page?param=hi';
            setRouting(requestHandlers);
            assert.isTrue(requestHandlers.page.calledWith({ param: 'hi' }));
        });

        test('a route receives multiple query parameters', () => {
            window.location.hash = '#page?param=hi&param2=nö';
            setRouting(requestHandlers);
            assert.isTrue(requestHandlers.page.calledWith({
                param: 'hi',
                param2: 'nö'
            }));
        });
    });

    suite('redirect', () => {
        setup(() => {
            setRouting(requestHandlers);
        });

        test('redirects to a page', () => {
            router.redirect('index');
            assert.isTrue(requestHandlers.index.called);
            router.redirect('page');
            assert.isTrue(requestHandlers.page.called);
        });

        test('adds query parameters to url', () => {
            router.redirect('page', { id: 1, di: 'hi' });
            assert.isTrue(requestHandlers.page.calledWith({ id: '1', di: 'hi' }));
        });

        test('sends redirect function to a requestHandler', () => {
            assert.isTrue(requestHandlers.index.calledWith({}, router.redirect));
        });
    });

    function setRouting(requestHandlers) {
        router.setRequestHandlers(requestHandlers);
        router.beginRouting();
    }

    function windowStub() {
        var hash = '';
        var onHashChangeCB = () => {};

        return {
            location: {
                get hash() {
                    return hash;
                },
                set hash(value) {
                    hash = value;
                    onHashChangeCB();
                }
            },

            addEventListener(eventType, callback) {
                if (eventType === 'hashchange') {
                    onHashChangeCB = callback;
                }
            },
        };
    }
});
