(function(starterApp) {
    starterApp.PostStorage = PostStorage;

    function PostStorage(storageHandler) {
        return {
            getPosts: getPosts,
            getPost: getPost,
            savePost: savePost,
            removePost: removePost,
            clearPosts: clearPosts,
            getLastSavedPost: getLastSavedPost,
        };

        function getPosts(callback) {
            // get list of resource metadata in order to load them all individually
            // since you cannot load all resources at once
            storageHandler.listResourceMetaDatas(function(error, resources) {
                if (error) {
                    callback(error);
                }

                if (resources.length === 0) {
                    callback(null, []);
                }

                var ids = resources.map(function(r) { return r.metadata.id; });
                var posts = [];
                ids.forEach(function(id) {
                    getPost(id, function(error, post) {
                        if (error) {
                            callback(error);
                        }
                        posts.push(post);
                        var gotAllPosts = posts.length === resources.length;
                        if (gotAllPosts) {
                            callback(null, posts);
                        }
                    });
                });
            });
        }

        function getPost(id, callback) {
            storageHandler.readResource(id, callbackWithPost(callback));
        }

        function savePost(post, callback) {
            var id = post.id;
            delete post.id;
            delete post.lastChangeDate;
            if (id === undefined || id === '') {
                storageHandler.createResource(post, callbackWithPost(callback));
            } else {
                storageHandler.updateResource(id, post, callbackWithPost(callback));
            }
        }

        function removePost(id, callback) {
            storageHandler.deleteResource(id, callback);
        }

        function clearPosts(callback) {
            storageHandler.listResourceMetaDatas(function(error, resources) {
                if (error) {
                    callback(error);
                }

                if (resources.length === 0) {
                    callback(null);
                }

                var ids = resources.map(function(r) { return r.id; });
                var posts = [];
                ids.forEach(function(id) {
                    removePost(id, function(error) {
                        if (error) {
                            callback(error);
                        }
                        posts.push(id);
                        var gotAllPosts = posts.length === resources.length;
                        if (gotAllPosts) {
                            callback(null);
                        }
                    });
                });
            });
        }

        function getLastSavedPost(callback) {
            storageHandler.readLatestResource(null, callbackWithPost(callback));
        }

        function callbackWithPost(callback) {
            return function(error, resource) {
                if (error) return callback(error);
                if (resource === null) {
                    return callback(null, null);
                }
                resource.content.id = resource.metadata.id;
                resource.content.lastChangeDate = resource.metadata.published;
                callback(null, resource.content);
            };
        }
    }
})(golab.tools.starterApp);
