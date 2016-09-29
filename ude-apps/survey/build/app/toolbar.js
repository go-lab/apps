'use strict';

(function (ReflectionPoll) {
    ReflectionPoll.Toolbar = Toolbar;

    function Toolbar(container, getMsg, options) {
        container = $(container);
        options = options || {};

        var showLabels = options.showLabels || false;
        var actionLinkClickEvents = ReflectionPoll.PubSub();
        var focusTrap = getFocusTrap();

        renderPollViewTools();

        return {
            onActionClick: subscribeToActionClick,
            showConfigTools: function showConfigTools() {
                renderConfigTools();
            },
            showPollViewTools: function showPollViewTools() {
                renderPollViewTools();
            },
            showResultsViewTools: function showResultsViewTools() {
                renderResultsViewTools();
            },
            showDownloadCSVTools: function showDownloadCSVTools() {
                renderDownloadCSVTools();
            }
        };

        function renderConfigTools() {
            container.empty();
            $('<ul></ul>').appendTo(container).append(saveTool()).append(abortTool()).append(importTool()).append(exportTool()).append(focusTrap);
        }

        function renderPollViewTools() {
            container.empty();
            $('<ul></ul>').appendTo(container).append(viewConfigTool()).append(viewResultsTool()).append(downloadTool()).append(focusTrap);
        }

        function renderResultsViewTools() {
            container.empty();
            $('<ul></ul>').appendTo(container).append(viewConfigTool()).append(viewPollTool()).append(downloadTool()).append(viewRefreshResultsTool()).append(focusTrap);
        }

        function saveTool() {
            return actionLink('save', 'save', 'save-file');
        }

        function abortTool() {
            return actionLink('abort', 'abort_changes', 'remove');
        }

        function viewConfigTool() {
            return actionLink('configure', 'configure', 'cog');
        }

        function viewResultsTool() {
            return actionLink('view_results', 'view_results', 'stats');
        }

        function viewPollTool() {
            return actionLink('view_poll', 'view_poll', 'stats');
        }

        function viewRefreshResultsTool() {
            return actionLink('view_results', 'refresh_results', 'refresh');
        }

        function importTool() {
            return actionLink('import', 'import', 'import');
        }

        function exportTool() {
            return actionLink('export', 'export', 'export');
        }

        function downloadTool() {
            return actionLink('download', 'download', 'download');
        }

        function getFocusTrap() {
            return $('<a href="#" class="focus_trap sr-only" aria-hidden="true" tabindex="-1"></a>');
        }

        // action link is just a link with an icon, and click events are published
        // to `actionLinkClickEvents`
        function actionLink(actionName, msgKey, glyphiconKey) {
            var msg = ReflectionPoll.util.escapeHTML(getMsg(msgKey));
            var link = $('<a href="#"></a>').append($('<span aria-hidden="true" class="glyphicon glyphicon-' + glyphiconKey + '"></span>'));

            if (showLabels) {
                link.append(' ' + msg);
            } else {
                link.attr('title', msg);
            }

            var item = $('<li></li>').append(link);

            item.on('click', function (event) {
                event.preventDefault();
                actionLinkClickEvents.publish(actionName);
                focusTrap.focus();
            });

            return item;
        }

        function subscribeToActionClick(actionName, handler) {
            actionLinkClickEvents.subscribe(function (clickedAction) {
                if (clickedAction === actionName) {
                    handler.apply(null, Array.prototype.slice.call(arguments, 1));
                }
            });
        }
    }
})(golab.tools.ReflectionPoll);
//# sourceMappingURL=toolbar.js.map
