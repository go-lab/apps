'use strict';

(function (ReflectionPoll) {
    var actionHandler = function actionHandler(state, actions, render, actionName) {
        for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
            args[_key - 4] = arguments[_key];
        }

        var handler = actions.get(actionName);
        if (typeof handler !== 'function') {
            throw new Error('Unhandled action "' + actionName + '"');
        }
        args = [state].concat(args);
        var newState = handler.apply(null, args);
        render(newState);
    };

    var escapeHTML = function escapeHTML(string) {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;'
        };

        string = '' + string;
        return string.replace(/[&<>"'\/]/g, function (c) {
            return entityMap[c];
        });
    };

    var formatDate = function formatDate(date, format) {
        return window.moment(date).format(format);
    };

    var shallowEqualImmutable = function shallowEqualImmutable(objA, objB) {
        // adapted from https://github.com/jurassix/react-immutable-render-mixin
        if (objA === objB || Immutable.is(objA, objB)) {
            return true;
        }

        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
            return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Test for A's keys different from B.
        var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
        for (var i = 0; i < keysA.length; i++) {
            if (!bHasOwnProperty(keysA[i]) || !Immutable.is(objA[keysA[i]], objB[keysA[i]])) {
                return false;
            }
        }

        return true;
    };

    var ImmutableRenderMixin = {
        shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
            return !shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState);
        }
    };

    var sha256 = function sha256(text) {
        var sha = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
        sha.update(text);
        return sha.getHash('B64');
    };

    ReflectionPoll.util = {
        ImmutableRenderMixin: ImmutableRenderMixin,
        escapeHTML: escapeHTML,
        formatDate: formatDate,
        sha256: sha256,
        uuid: function uuid() {
            return window.uuid.v4();
        },
        classNames: window.classNames,
        promisifyAll: Promise.promisifyAll,
        actionHandler: actionHandler,
        debounce: function debounce(fn, delay) {
            return $.debounce(delay, fn);
        }
    };
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=util.js.map
