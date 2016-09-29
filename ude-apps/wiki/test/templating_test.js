import * as util from 'app/util';
import { DomLoader, Templating } from 'app/templating';

suite('Templating', () => {
    var assert = chai.assert;

    suite('loading strategies', () => {
        suite('domLoader', () => {
            var fixture, document, loader;

            setup(() => {
                fixtures.set('');
                document = fixtures.window().document;
                fixture = fixtures.window().document.body;
                loader = DomLoader(document);
            });

            teardown(() => {
                fixtures.cleanUp();
            });

            test('getTemplate', () => {
                var expectedTemplate = '<b>Hi!</b>';
                makeDomTemplate('template', expectedTemplate);

                var actualTemplate = loader.getTemplate('template');
                return assert.becomes(actualTemplate, expectedTemplate);
            });

            test('throwing errors when template is not found', () => {
                return assert.isRejected(loader.getTemplate('scrabla'),
                                  'There is no template "scrabla".');
            });

            test('getPartials', () => {
                var partials = {
                    partial1: 'hi',
                    partial2: 'no'
                };

                makeDomTemplate('partial1', partials.partial1, true);
                makeDomTemplate('partial2', partials.partial2, true);

                return assert.becomes(loader.getPartials(), partials);
            });

            test('throws an error when there is a script with data-partial but no data-template attribute', () => {
                fixture.innerHTML += '<script data-partial></script>';
                var partials = loader.getPartials();
                var message = 'Found partial template that misses a "data-template" attribute.';
                return assert.isRejected(partials, message);
            });

            function makeDomTemplate(name, content, isPartial = false) {
                var partialText = '';

                if (isPartial) {
                    partialText = 'data-partial';
                }

                fixture.innerHTML +=
                    `<script data-template="${name}" ${partialText}
                    type="text/x-handlebars-template">${content}</script>`;
            }
        });
    });

    suite('rendering', () => {
        var templating, target, document, loader;

        setup(() => {
            fixtures.set('<div id="target"></div>');
            document = fixtures.window().document;
            target = document.body.querySelector('#target');
            loader = {
                getTemplate: sinon.stub(),
                getPartials: sinon.stub(),
            };
            setPartials({});
            templating = Templating(target, loader);
        });

        test('render target is exposed', () => {
            assert.equal(templating.target, target);
        });

        test('rendering a template', () => {
            var template = '<span>Hi</span>';
            addTemplate('test', template);
            return templating.render('test').then(() => {
                assertTarget(template);
            });
        });

        test('rendering with variables', () => {
            var template = '{{ var }}';
            var variable = 'Hello!';
            addTemplate('test', template);
            return templating.render('test', { var: variable }).then(() => {
                assertTarget(variable);
            });
        });

        test('rendering partials', () => {
            addTemplate('test', '{{> hey }} {{> you }}');
            setPartials({
                hey: '{{ hey }}',
                you: '{{ you }}',
            });

            return templating.render('test', { hey: 'Hey', you: 'you!' }).then(() => {
                assertTarget('Hey you!');
            });
        });

        test('partials only get loaded once', () => {
            addTemplate('test', '');
            var calls = [templating.render('test'), templating.render('test')];
            return util.p.all(calls).then(() => {
                assert.isTrue(loader.getPartials.calledOnce);
            });
        });

        function addTemplate(templateName, template) {
            loader.getTemplate.withArgs(templateName).returns(util.p.resolve(template));
        }

        function setPartials(partials) {
            loader.getPartials.returns(util.p.resolve(partials));
        }

        function assertTarget(content) {
            assert.equal(target.innerHTML, content);
        }
    });
});
