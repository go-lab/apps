'use strict';

(function (ReflectionPoll) {
    var serviceUrl = function serviceUrl(pollId, hash) {
        pollId = encodeURIComponent(pollId);
        hash = encodeURIComponent(hash);
        return 'http://golab.collide.info/analytics/reflection_poll_responses' + ('?pollId=' + pollId + '&pollContentHash=' + hash);
    };

    ReflectionPoll.fetchAggregatedResults = function (poll) {
        return fetch(serviceUrl(poll.get('id'), poll.get('contentHash'))).then(throwOnErrorState).then(function (response) {
            return response.json();
        }).then(function (results) {
            return Immutable.fromJS(results);
        });
    };

    function throwOnErrorState(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        var error = new Error('Failed response request. HTTP status: ' + response.statusText + '.');
        return response.json().then(function (body) {
            error.details = body;
            throw error;
        });
    }
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=fetch_aggregated_results.js.map
