(function(starterApp) {
    starterApp.Application = Application;

    function Application(environmentHandlers, loadingIndicator, errorDisplay) {
        var actionLogger       = environmentHandlers.actionLogger;
        var notificationClient = environmentHandlers.notificationClient;
        var storageHandler     = environmentHandlers.storageHandler;
        var metadataHandler    = environmentHandlers.metadataHandler;
        var languageHandler    = environmentHandlers.languageHandler;
        var configHandler      = environmentHandlers.configHandler;

        var postStorage  = starterApp.PostStorage(storageHandler);
        var toolbar      = starterApp.Toolbar($('#toolbar'), languageHandler, {
            showLabels: false,
            hideConfiguration: metadataHandler.getContext() === 'ils',
        });
        var postEditor = starterApp.PostEditor($('#post'), languageHandler);
        var postsList  = starterApp.PostsList($('#posts_list'), languageHandler);
        var configDialog = starterApp.ConfigDialog($('#config'), languageHandler);
        var notificationDisplay = starterApp.NotificationDisplay($('#notifications'));

        var currentPost = {};

        notificationClient.register(function(notification) {
            return true;
        }, handleNotification);

        console.log('The application started. Yay!');
        actionLogger.logApplicationStarted();

        logIlsPhases();
        loadInitialPost();

        toolbar.onActionClick('new', function() {
            try {
                loadingIndicator.show();
                if (discardPotentialChanges()) {
                    setCurrentPost(newPost());
                }
            } catch(error) {
                handleError(error, languageHandler.getMessage('display_error'));
            }
        });

        toolbar.onActionClick('configure', function() {
            try {
                openConfig();
            } catch(error) {
                handleError(error);
            }
        });

        toolbar.onActionClick('open', function() {
            try {
                if (discardPotentialChanges()) {
                    showPostsList();
                }
            } catch(error) {
                handleError(error);
            }
        });

        toolbar.onActionClick('save', function() {
            try {
                save();
            } catch(error) {
                handleError(error, languageHandler.getMessage('save_error'));
            }
        });

        toolbar.onActionClick('duplicate', function() {
            try {
                duplicatePost();
            } catch(error) {
                handleError(error, languageHandler.getMessage('save_error'));
            }
        });

        toolbar.onActionClick('remove', function() {
            try {
                removePost();
            } catch(error) {
                handleError(error, languageHandler.getMessage('remove_error'));
            }
        });

        postsList.onOpenPost(function(postId) {
            loadPost(postId);
            postsList.hide();
        });

        configDialog.onReset(function() {
            loadingIndicator.show();
            configDialog.hide();
            configHandler.resetToDefaultConfig(function(error) {
                if (error) {
                    handleError(error,
                                languageHandler.getMessage('reset_config_error'));
                }
                loadingIndicator.hide();
            });
        });

        configDialog.onSave(function(newConfig) {
            loadingIndicator.show();
            configDialog.hide();
            configHandler.writeConfig(newConfig, function(error, newConfig) {
                if (error) {
                    handleError(error,
                                languageHandler.getMessage('save_config_error'));
                }
                loadingIndicator.hide();
            });
        });

        function handleNotification(notification) {
            console.log('Notification received: %o', notification);
            notificationDisplay.display(notification);
        }

        function displayAppEnvironment() {
            $('h1').append(' (' + metadataHandler.getContext() + ')');
        }

        function loadInitialPost() {
            var lastSavedPost = postStorage.getLastSavedPost(function(error, post) {
                if (error) {
                    handleError(error, languageHandler.getMessage('load_error'));
                } else {
                    post = post || newPost();
                    setCurrentPost(post);
                }
            });
        }

        function newPost() {
            return {
                id: '',
                title: configHandler.getEntry('defaultTitle'),
                content: '',
                isNew: true,
            };
        }

        function setCurrentPost(post) {
            currentPost = post;
            renderPostEditor(post);
            logViewPost(post, post.isNew);
            loadingIndicator.hide();
        }

        function renderPostEditor(post) {
            try {
                postEditor.render(post);
            } catch(error) {
                handleError(error, languageHandler.getMessage('display_error'));
            }
            loadingIndicator.hide();
        }

        function discardPotentialChanges() {
            var newContent = postEditor.getPostContent();
            var hasChanges = currentPost.content !== newContent;
            if (hasChanges) {
                return confirm(languageHandler.getMessage('unsaved_changes_prompt'));
            }
            return true;
        }

        function showPostsList() {
            loadingIndicator.show();
            postStorage.getPosts(function(error, posts) {
                if (error) {
                    handleError(error, languageHandler.getMessage('load_posts_error'));
                } else {
                    postsList.show(posts);
                    loadingIndicator.hide();
                }
            });
        }

        function save() {
            var newContent = postEditor.getPostContent();
            var postTitle  = currentPost.title;
            var hasChanges = currentPost.content !== newContent;
            if (currentPost.isNew) {
                postTitle = postTitlePrompt(currentPost.title);
                if (postTitle === null) {
                    return;
                }
            } else if (! hasChanges) {
                return;
            }
            var post = {
                id: currentPost.id,
                title: postTitle,
                content: newContent
            };
            loadingIndicator.show();
            postStorage.savePost(post, function(error, post) {
                if (error) {
                    handleError(error, languageHandler.getMessage('save_error'));
                } else {
                    logPostEdit(post, currentPost.isNew);
                    triggerTestNotification(actionLogger, metadataHandler);
                    setCurrentPost(post);
                }
            });
        }

        function duplicatePost() {
            if (! discardPotentialChanges()) {
                return;
            }
            var newTitle = languageHandler.getMessage('copy_of_post',
                                                          currentPost.title);
            var newPost = {
                title: newTitle,
                content: currentPost.content,
                isNew: true,
            };
            setCurrentPost(newPost);
            save();
        }

        function removePost() {
            var currentPostWasSaved = currentPost.id !== undefined &&
                                      currentPost.id !== '';
            if (! currentPostWasSaved) {
                return loadInitialPost();
            }
            var confirmMsg = languageHandler.getMessage('post_removal_confirmation',
                                                        currentPost.title);
            if (! confirm(confirmMsg)) {
                return;
            }
            loadingIndicator.show();
            postStorage.removePost(currentPost.id, function(error) {
                if (error) {
                    handleError(error, languageHandler.getMessage('delete_error'));
                } else {
                    loadInitialPost();
                }
            });
        }

        function loadPost(postId) {
            loadingIndicator.show();
            postStorage.getPost(postId, function(error, post) {
                if (error) {
                    handleError(error, languageHandler.getMessage('load_error'));
                } else {
                    setCurrentPost(post);
                }
            });
        }

        function postTitlePrompt(initialTitle) {
            initialTitle = initialTitle || '';
            return prompt(languageHandler.getMessage('post_title') + ':', initialTitle);
        }

        function logPostEdit(post, isNewPost) {
            var logObject = {
                objectType: 'post',
                id: post.id,
                content: post,
            };
            if (isNewPost) {
                actionLogger.logAdd(logObject);
            } else {
                actionLogger.logChange(logObject);
            }
        }

        function logViewPost(post, isNewPost) {
            var logObject = {
                objectType: 'post',
                id: post.id,
                isNew: isNewPost || false
            };
            actionLogger.logAccess(logObject);
        }

        function handleError(error, userMessage) {
            userMessage = userMessage || languageHandler.getMessage('error_occured');
            //TODO check hypothesis scratchpad / dataViewer / Report Tool how to fetch the URL --> evtl: schon im metadataHandler oder evtl. actionLogger.getDeviceInfo: ()
            //"object.content.line": 1,
            //    "object.content.url": 1,
            //    "object.content.message": 1,
            var errorObject = {objectType:"error", content:{message:userMessage}, error:error};
            actionLogger.log("send", errorObject);
            errorDisplay.show(userMessage);
            console.error(error.stack);
            loadingIndicator.hide();
        }

        function triggerTestNotification(actionLogger, metadataHandler) {
            // there is an agent on the server that sends test notifications to clients
            // that send action logs with the `objectType` of the `target` set to
            // `notification-test`

            // we modify the target in the metadata so the test agent receives the log
            var originalTarget = metadataHandler.getTarget();
            metadataHandler.setTarget({
                'objectType': 'notification-test',
                'id': 'xxx',
            });

            // sending the log, which will trigger the test agent on the server
            actionLogger.log('access', {
                id: 'object',
                objectType: 'testObject',
                displayName: 'hi',
            });

            // resetting metadata
            metadataHandler.setTarget(originalTarget);
        }

        function logIlsPhases() {
            if (metadataHandler.getContext() !== 'ils') {
                return;
            }
            getIlsPhases(function(err, phases, currentPhase) {
                if (err) {
                    return console.err('Error while requesting the ils phases.', err);
                }
                var phaseNames = phases.map(function(phase) {
                    return phase.displayName;
                });
                console.log(
                    'Current phase: %s.\nAll phases: %s',
                    currentPhase.displayName,
                    phaseNames.join(', ')
                );
            });
        }

        function getIlsPhases(callback) {
            var isPublicSpace = function(space) {
                return space.visibilityLevel === 'public';
            };
            ils.getIls(function(ilsSpace, currentPhase) {
                ils.getSubspacesBySpaceId(ilsSpace.id, function(phases) {
                    phases = phases.filter(isPublicSpace);
                    callback(null, phases, currentPhase);
                });
            });
        }

        function openConfig() {
            configDialog.show({
                defaultTitle: configHandler.getEntry('defaultTitle'),
            });
        }
    }
})(golab.tools.starterApp);
