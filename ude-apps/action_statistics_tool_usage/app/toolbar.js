(function(actionStatistics) {
    var util = actionStatistics.util;
    var PubSub = actionStatistics.PubSub;

    actionStatistics.Toolbar =
    function Toolbar(container, getMessage, options) {
        container = $(container);
        options   = options || {};

        var showLabels = options.showLabels || false;
        var showGraaspUserFilter = options.showGraaspUserFilter || false;
        var actionLinkClickEvents = PubSub();
        var showGraaspUsersChangeEvents = PubSub();
        var focusTrap = getFocusTrap();

        render();

        return {
            onActionClick: subscribeToActionClick,
            onShowGraaspUsersChange: showGraaspUsersChangeEvents.subscribe,
        };

        function render() {
            var ul = $('<ul></ul>').appendTo(container);
            ul.append(refreshDataTool());
            if (showGraaspUserFilter) {
                ul.append(graaspUserFilterTool());
            }
            ul.append(focusTrap);
        }

        function refreshDataTool() {
            return actionLink('refresh', 'refresh', 'refresh');
        }

        function graaspUserFilterTool() {
            var input = $('<input type="checkbox" />');
            input.on('change', function() {
                showGraaspUsersChangeEvents.publish(input.prop('checked'));
            });
            return $('<li />')
            .append($('<label />').append(input))
            .append(' ' + getMessage('show_graasp_users'));
        }

        function getFocusTrap() {
            return $('<a href="#" class="focus_trap sr-only" aria-hidden="true"></a>');
        }

        // action link is just a link with an icon, and click events are published
        // to `actionLinkClickEvents`
        function actionLink(actionName, msgKey, glyphiconKey) {
            var msg = util.escapeHTML(getMessage(msgKey));
            var link = $('<a href="#"></a>')
            .append($('<span aria-hidden="true" class="glyphicon glyphicon-' +
                      glyphiconKey + '"></span>'));

            if (showLabels) {
                link.append(' ' + msg);
            } else {
                link.attr('title', msg);
            }

            var item = $('<li></li>').append(link);

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
    };
})(golab.tools.actionStatistics);
