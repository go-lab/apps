((ReflectionPoll) => {
    const { util, Poll } = ReflectionPoll;

    ReflectionPoll.AnswersRepo =
    function AnswersRepo(storageHandler) {
        util.promisifyAll(storageHandler);

        return {
            load: load,
            save: save
        };

        function load(poll) {
            return storageHandler.readLatestResourceAsync(null).then(function(resource) {
                if (resource !== null) {
                    if (resourceMatchesPoll(poll, resource)) {
                        return answersFromResource(poll, resource);
                    }
                }
                return saveNewAnswers(poll);
            }).then((answers) => {
                return removeStaleAnswers().return(answers);
            }).catch(handleStorageError);
        }

        function save(poll, answers) {
            answers = answers
            .set('pollId', poll.get('id'))
            .set('pollContentHash', poll.get('contentHash'));
            return storageHandler.updateResourceAsync(answers.get('id'), answers.toJS())
            .then(function() {
                // do nothing
            })
            .catch(handleStorageError);
        }

        function saveNewAnswers(poll) {
            const defaultAnswers = Poll.getAnswers(poll)
            .set('pollContentHash', poll.get('contentHash'))
            .toJS();
            return storageHandler.createResourceAsync(defaultAnswers).then(function(resource) {
                return answersFromResource(poll, resource);
            });
        }

        function removeStaleAnswers() {
            return Promise.all([
                storageHandler.readLatestResourceAsync(null),
                storageHandler.listResourceMetaDatasAsync()
            ]).spread((latestResource, resources) => {
                const deletions = resources
                .map(({ metadata }) => {
                    return {
                        id: metadata.id,
                        published: new Date(metadata.published)
                    };
                })
                .filter((m) => m.id !== latestResource.metadata.id)
                .map((m) => null);
		return Promise.all(deletions);
            }).catch(handleStorageError);
        }

        function handleStorageError(error) {
            if (error.error) {
                throw new Error(error.error);
            } else {
                throw error;
            }
        }

        function answersFromResource(poll, resource) {
            return Poll
            .answersFromJSToImmutable(poll, resource.content)
            .set('id', resource.metadata.id);
        }

        function resourceMatchesPoll(poll, resource) {
            return poll.get('contentHash') === resource.content.pollContentHash;
        }
    };
})(golab.tools.ReflectionPoll);
