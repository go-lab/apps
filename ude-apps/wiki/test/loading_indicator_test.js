import LoadingIndicator from 'app/loading_indicator';

suite('LoadingIndicator', () => {
    var domRoot, element, elementText, actualInterval, interval, intervalCallback,
        maxDots, loadingIndicator;
    var assert = chai.assert;

    setup(() => {
        fixtures.set('<div id="loading">Something is loading</div>');
        domRoot = fixtures.window().document;
        element = domRoot.querySelector('#loading');
        elementText = element.textContent;
        interval = 10;
        maxDots = 4;
        var mySetInterval = (callback, _interval) => {
            actualInterval = _interval;
            intervalCallback = callback;
        };
        loadingIndicator = LoadingIndicator(element, {
            interval,
            maxDots,
            setInterval: mySetInterval
        });
    });

    teardown(() => {
        fixtures.cleanUp();
        loadingIndicator.stop();
    });

    test('text contained in the element is persisted', () => {
        assert.equal(element.textContent.indexOf(elementText), 0);
    });

    test('correct interval is set', (done) => {
        setTimeout(() => {
            assert.equal(interval, actualInterval);
            done();
        }, 0);
    });

    test('after zero intervals passed, a dot is appended', (done) => {
        assertDotsAppended({ interval, dotCount: 1, intervalsPassed: 0 }, done);
    });

    test('after one interval passed, two dots are appended', (done) => {
        assertDotsAppended({ interval, dotCount: 2, intervalsPassed: 1 }, done);
    });

    test('after two intervals passed, three dots are appended', (done) => {
        assertDotsAppended({ interval, dotCount: 3, intervalsPassed: 2 }, done);
    });

    test('after "maxDots - 1" intervals passed, "maxDots" dots are appended', (done) => {
        assertDotsAppended({ interval, dotCount: maxDots, intervalsPassed: maxDots - 1 }, done);
    });

    test('after "maxDots" intervals passed, the cycle is back to one dot', (done) => {
        assertDotsAppended({ interval, dotCount: 1, intervalsPassed: maxDots }, done);
    });

    test('stopping resets the text', function() {
        loadingIndicator.stop();
        assert.equal(element.textContent, elementText);
    });

    function assertDotsAppended({ interval, dotCount, intervalsPassed }, done) {
        passIntervals(intervalsPassed);

        var appendage = element.textContent.slice(elementText.length);
        assert.equal(appendage, getDots(dotCount));
        done();
    }

    function getDots(count) {
        var dots = '';
        for (var i = 1; i <= count; i++) {
            dots += '.';
        }
        return dots;
    }

    function passIntervals(count) {
        for (var i = 0; i < count; i++) {
            intervalCallback();
        }
    }
});
