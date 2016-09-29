(function(ReflectionPoll) {
    const util = ReflectionPoll.util;
    const Poll = ReflectionPoll.Poll;

    ReflectionPoll.PollRepo =
    function PollRepo(storageHandler) {
        util.promisifyAll(storageHandler);
        filterOnlyForResourceType();

        return {
            load: load,
            save: save
        };

        function load() {
            return storageHandler.readLatestResourceAsync(null).then(function(resource) {
                if (resource === null) {
                    return saveNewPoll();
                }
                return pollFromResource(resource);
            }).catch(handleStorageError);
        }

        function save(poll) {
            return storageHandler.updateResourceAsync(poll.get('id'), poll.toJS())
            .then(function() {
                // do nothing
            })
            .catch(handleStorageError);
        }

        function saveNewPoll() {
            return storageHandler.createResourceAsync(Poll.newPoll().toJS())
            .then(function(resource) {
                return pollFromResource(resource);
            });
        }

        function handleStorageError(error) {
            if (error.error) {
                throw new Error(error.error);
            } else {
                throw error;
            }
        }

        function pollFromResource(resource) {
            return Immutable.fromJS(resource.content).set('id', resource.metadata.id);
        }

        function filterOnlyForResourceType() {
            storageHandler.configureFilters(true, false, false, true);
        }
    };
})(golab.tools.ReflectionPoll);
