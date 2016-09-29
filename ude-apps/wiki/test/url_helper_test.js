import { extractUrlParts, composeUrlParts } from 'app/url_helper';

suite('urlHelper', () => {
    var assert = chai.assert;
    var urls = [
        { url: 'page', path: 'page', params: {} },
        { url: 'page/index', path: 'page/index', params: {} },
        { url: 'page?param1=page', path: 'page', params: { param1: 'page' } },
        {
            url: 'page/index?param1=page',
            path: 'page/index',
            params: { param1: 'page'}
        }, {
            url: 'page/index?param1=page&paröm2=hällö',
            path: 'page/index',
            params: { param1: 'page', 'paröm2': 'hällö' }
        }, {
            url: '?param=hi',
            path: '',
            params: { param: 'hi' }
        }, {
            url: 'page?param=hi',
            path: 'page',
            params: { param: 'hi' }
        }, {
            url: '?',
            cleanUrl: '',
            path: '',
            params: {}
        }, {
            url: '#',
            cleanUrl: '',
            path: '',
            params: {}
        }, {
            url: '#?param=hello',
            cleanUrl: '?param=hello',
            path: '',
            params: { param: 'hello' }
        }, {
            url: '?param=hello&',
            cleanUrl: '?param=hello',
            path: '',
            params: { param: 'hello' }
        }, {
            url: '?param',
            cleanUrl: '?param=',
            path: '',
            params: { param: '' }
        }, {
            url: '?param=&param2=hi',
            path: '',
            params: { param: '', param2: 'hi' }
        },  {
            url: '?param&param2=hi',
            cleanUrl: '?param=&param2=hi',
            path: '',
            params: { param: '', param2: 'hi' }
        }, {
            url: '?=',
            cleanUrl: '',
            path: '',
            params: {},
        },
    ];

    suite('extracting parts of an url', () => {
        var parts;
        testForEachUrl(urls, (url) => `For URL: ${url.url}`, (url) => {
            parts = extractUrlParts(url.url);
            assert.equal(parts.path, url.path, 'Path does not match');
            assert.deepEqual(parts.queryParameters,
                             url.params,
                             'QueryParameters do not match');
        });
    });

    suite('composing parts of an url into a string', () => {
        var composedUrl, expectedUrl;
        var testName = (url) => {
            return `For path "${url.path}"
                    and params "${JSON.stringify(url.params)}"`;
        };
        testForEachUrl(urls, testName, (url) => {
            composedUrl = composeUrlParts(url.path, url.params);
            expectedUrl = url.cleanUrl !== undefined ? url.cleanUrl : url.url;
            assert.equal(composedUrl,
                         expectedUrl,
                         'The url does not match the expected url');
        });
    });
});

function testForEachUrl(urls, testName, fn) {
    urls.forEach((url) => {
        test(testName(url), () => {
            fn(url);
        });
    });
}
