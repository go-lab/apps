import * as util from 'app/util';

export class TemplatingError extends Error {
    constructor(message) {
        super();
        this.name = 'TemplatingError';
        this.message = message;
    }
}

export function makeDomTemplating(renderTarget, container) {
    return Templating(renderTarget, DomLoader(container));
}

export function Templating(renderTarget, loader) {
    var partialsPromise;

    function render(templateName, variables) {
        return get(templateName, variables).then((html) => {
            renderTarget.innerHTML = html;
        });
    }

    function get(templateName, variables) {
        return loadPartials().then(() => {
            return loader.getTemplate(templateName).then((template) => {
                return Handlebars.compile(template)(variables);
            });
        });
    }

    function loadPartials() {
        if (partialsPromise) return partialsPromise;

        partialsPromise = loader.getPartials().then(registerPartials);

        return partialsPromise;
    }

    function registerPartials(partials) {
        Object.keys(partials).forEach((partialName) => {
            Handlebars.registerPartial(partialName, partials[partialName]);
        });
    }

    return { render, get: get, target: renderTarget };
}


export function DomLoader(templateContainer) {
    function getTemplate(templateName) {
        var selector = `script[data-template="${templateName}"]`;
        var template = templateContainer.querySelector(selector);

        if (template === null) {
            return util.p.reject(
                new TemplatingError(`There is no template "${templateName}".`)
            );
        }

        return util.p.resolve(template.textContent);
    }

    function getPartials() {
        var defer = util.p.defer();

        var partialName, partials = {};
        var partialElements = templateContainer.querySelectorAll('[data-partial]');
        partialElements = Array.prototype.slice.apply(partialElements);

        partialElements.forEach((partialElement) => {
            partialName = partialElement.getAttribute('data-template');
            if (partialName === null) {
                defer.reject(
                    new TemplatingError('Found partial template that misses a "data-template" attribute."')
                );
            }
            partials[partialName] = partialElement.textContent;
        });

        defer.resolve(partials);

        return defer.promise;
    }

    return { getTemplate, getPartials };
}
