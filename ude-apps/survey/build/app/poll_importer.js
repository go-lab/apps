'use strict';

(function (ReflectionPoll) {
    ReflectionPoll.PollImporter = {
        convert: function convert(newPollString, referencePoll) {
            var conversion = Immutable.Map({
                error: null,
                poll: null,
                isDowngrade: false
            });
            var importedPoll = undefined;

            try {
                importedPoll = Immutable.fromJS(JSON.parse(newPollString));
            } catch (error) {
                return conversion.set('error', 'parse');
            }

            importedPoll = mergeSameKeys(referencePoll, importedPoll);
            var isDowngrade = importedPoll.get('appVersion') > referencePoll.get('appVersion');

            importedPoll = importedPoll.set('appVersion', referencePoll.get('appVersion')).set('id', referencePoll.get('id'));

            return conversion.set('poll', importedPoll).set('isDowngrade', isDowngrade);
        }
    };

    function mergeSameKeys(map1, map2) {
        return map1.map(function (value, key) {
            return map2.get(key, value);
        });
    }
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=poll_importer.js.map
