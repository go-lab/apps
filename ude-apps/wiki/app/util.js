import { composeUrlParts } from 'app/url_helper';

var global = window;

// removes libraries from global namespace and instead collects them under `libs`
var libs = ['reqwest', 'marked', 'uuid'].reduce((libs, lib) => {
    libs[lib] = global[lib];
    if (libs[lib] === undefined || libs[lib] === null)
        throw new Error(`${lib} is not defined`);
    delete global[lib];
    return libs;
}, {});

export var o = {
    clone: _.clone,
    extend: _.extend,
};

export var uuid = libs.uuid.v1;


function promisifyObject(obj, methods) {
    return methods.reduce((newObj, method) => {
        newObj[method] = p.convertToPromise(obj[method], obj);
        return newObj;
    }, {});
}

// promises utilities. Mostly aliases bluebird library
// remember to write tests for methods that don't just alias bluebird!
export var p = {
    promisifyObject,
    resolve: Promise.resolve,
    reject: Promise.reject,
    defer: Promise.defer,
    all: Promise.all,
    spawn: Promise.spawn,
    makeTask: Promise.coroutine,
    convertToPromise: Promise.promisify,
};

export var http = {
    get: (url, queryParams) => {
        url = composeUrlParts(url, queryParams);
        return libs.reqwest({
            url: url,
            method: 'get',
            type: 'json',
        });
    },
    post: (url, formParams) => {
        return libs.reqwest({
            url: url,
            method: 'post',
            type: 'json',
            data: formParams,
        });
    },
};

export function markdownToHtml(md) {
    return libs.marked(md, { sanitize: true });
}
