((ReflectionPoll) => {
    const actionHandler = (state, actions, render, actionName, ...args) => {
        const handler = actions.get(actionName);
        if (typeof handler !== 'function') {
            throw new Error('Unhandled action "' + actionName + '"');
        }
        args = [state].concat(args);
        const newState = handler.apply(null, args);
        render(newState);
    };

    const escapeHTML = (string) => {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
        };

        string = '' + string;
        return string.replace(/[&<>"'\/]/g, (c) => {
            return entityMap[c];
        });
    };

    const formatDate = (date, format) => {
        return window.moment(date).format(format);
    };

    const shallowEqualImmutable = (objA, objB) => {
        // adapted from https://github.com/jurassix/react-immutable-render-mixin
        if (objA === objB || Immutable.is(objA, objB)) {
            return true;
        }

        if (typeof objA !== 'object' || objA === null ||
            typeof objB !== 'object' || objB === null) {
            return false;
        }

        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Test for A's keys different from B.
        const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
        for (let i = 0; i < keysA.length; i++) {
            if (!bHasOwnProperty(keysA[i]) || !Immutable.is(objA[keysA[i]], objB[keysA[i]])) {
                return false;
            }
        }

        return true;
    };

    const ImmutableRenderMixin = {
        shouldComponentUpdate(nextProps, nextState) {
            return !shallowEqualImmutable(this.props, nextProps) ||
                   !shallowEqualImmutable(this.state, nextState);
        },
    };

    const sha256 = (text) => {
        const sha = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' });
        sha.update(text);
        return sha.getHash('B64');
    };

    ReflectionPoll.util = {
        ImmutableRenderMixin,
        escapeHTML,
        formatDate,
        sha256,
        uuid: function() { return window.uuid.v4(); },
        classNames: window.classNames,
        promisifyAll: Promise.promisifyAll,
        actionHandler: actionHandler,
        debounce: (fn, delay) => $.debounce(delay, fn),
    };
})(golab.tools.ReflectionPoll);
