export class RouteError extends Error {
    constructor(message) {
        super();
        this.name = 'RouteError';
        this.message = message;
    }
}

import * as urlHelper from 'app/url_helper';
import { p }     from 'app/util';

function isIterator(val) {
    return val && typeof val.next === 'function' && typeof val.throw === 'function';
}

export function Router(window) {
    var requestHandlers = {};

    function invokeRoute(path, queryParams) {
        var requestHandler = requestHandlers[path];
        if (typeof requestHandler === 'function') {
            callRequestHandler(requestHandler, queryParams);
        } else {
            throw new RouteError(`There is no request handler for route "${path}".`);
        }
    }

    function callRequestHandler(requestHandler, queryParams) {
        var val = requestHandler(queryParams, redirect);
        if (isIterator(val)) {
            requestHandler = p.makeTask(requestHandler);
            requestHandler(queryParams, redirect);
        }
    }

    function getCurrentLocation() {
        return urlHelper.extractUrlParts(window.location.hash);
    }

    function navigateToCurrentLocation() {
        var { path, queryParameters } = getCurrentLocation();
        // golab quickfix
        if (path.indexOf('rpctoken') !== -1 || path.indexOf('view-params') !== -1) {
            path = '';
        }
        if (path === '') {
            path = 'index';
        }
        invokeRoute(path, queryParameters);
    }

    function redirect(page, params = {}) {
        window.location.hash = urlHelper.composeUrlParts(page, params);
    }

    return {
        setRequestHandlers(newRequestHandlers) {
            requestHandlers = newRequestHandlers;
        },

        beginRouting() {
            window.addEventListener('hashchange', function() {
                navigateToCurrentLocation();
            });

            navigateToCurrentLocation();
        },

        redirect
    };
}

export default Router;
