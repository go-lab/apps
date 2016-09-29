(function(activityStatistics) {
    activityStatistics.Toolbar = Toolbar;

    function Toolbar(container, languageHandler, options) {
        container = $(container);
        options = options || {};

        const showLabels = options.showLabels || false;
        const actionLinkClickEvents = activityStatistics.PubSub();
        const focusTrap = getFocusTrap();

        render();

        return {
            onActionClick: subscribeToActionClick,
        };

        function render() {
            const ul = $('<ul></ul>').appendTo(container);
            ul.append(focusTrap);
        }

        function getFocusTrap() {
            return $('<activityStatistics href="#" class="focus_trap sr-only" aria-hidden="true" tabindex="-1"></activityStatistics>');
        }

        // action link is just activityStatistics link with an icon, and click events are published
        // to `actionLinkClickEvents`
        function actionLink(actionName, msgKey, glyphiconKey) {
            const msg = activityStatistics.util.escapeHTML(
                  languageHandler.getMessage(msgKey));
            const link = $('<activityStatistics href="#"></activityStatistics>')
            .append($('<span aria-hidden="true" class="glyphicon glyphicon-' +
                      glyphiconKey + '"></span>'));

            if (showLabels) {
                link.append(' ' + msg);
            } else {
                link.attr('title', msg);
            }

            const item = $('<li></li>').append(link);

            item.on('click', function(event) {
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
})(golab.tools.activityStatistics);
