(function(conceptCloud) {
    conceptCloud.Toolbar = Toolbar;
    var formatDate = conceptCloud.util.formatDate;

    function Toolbar(container, languageHandler, options) {
        container = $(container);
        options   = options || {};

        var showLabels = options.showLabels || false;
        var hideConfiguration = options.hideConfiguration || false;
        var actionLinkClickEvents = conceptCloud.PubSub();
        var focusTrap = getFocusTrap();

        render(null);

        return {
            onActionClick: subscribeToActionClick,
            setLastRefresh: function(lastRefresh) {
                render(lastRefresh);
            },
        };

        function render(lastRefresh) {
            container.empty();
            var ul = $('<ul></ul>').appendTo(container);

            ul.append(refreshTool(lastRefresh));
            ul.append(lastRefreshStatus(lastRefresh));

            if (! hideConfiguration) {

                if(conceptCloud.aggregatedView) {
                    ul.append(configTool());
                }
            }

            ul.append(focusTrap);
        }

        function refreshTool(lastRefresh) {
            var iconClass = 'refresh fa-spin ';
            if (lastRefresh !== null) {
                iconClass += 'paused';
            }
            return actionLink('refresh', 'refresh', iconClass);
        }

        function lastRefreshStatus(lastRefresh) {
            if (lastRefresh === null) {
                return null;
            }
            var status = languageHandler.getMessage(
                'last_update_at',
                formatDate(lastRefresh, 'LT')
            );
            return $('<li></li>').addClass('refresh_status').append(status);
        }


        function configTool() {
            return actionLink('configure', 'configure', 'cog');
        }


        function getFocusTrap() {
            return $('<a href="#" class="focus_trap sr-only" aria-hidden="true"></a>');
        }

        // action link is just a link with an icon, and click events are published
        // to `actionLinkClickEvents`
        function actionLink(actionName, msgKey, faIconKey) {
            var msg = conceptCloud.util.escapeHTML(
                languageHandler.getMessage(msgKey));
            var link = $('<a href="#"></a>')
            .append($('<span aria-hidden="true" class="fa fa-' +
                      faIconKey + '"></span>'));

            if (showLabels) {
                link.append(' ' + msg);
            } else {
                link.attr('title', msg);
                link.addClass(actionName);
            }

            var item = $('<li></li>').append(link);

            item.on('click', function(event) {
               // console.log("HIER");
               // console.log(actionName);
                event.preventDefault();
                actionLinkClickEvents.publish(actionName);
                focusTrap.focus();
            });

            return item;
        }

        function subscribeToActionClick(actionName, handler) {
            actionLinkClickEvents.subscribe(function(clickedAction) {
                if (clickedAction === actionName) {
                    handler.apply(null, Array.prototype.slice.call(arguments, 1));
                }
            });
        }
    }
})(golab.tools.conceptCloud);
