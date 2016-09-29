(function(starterApp) {
    starterApp.Toolbar = Toolbar;

    function Toolbar(container, languageHandler, options) {
        container = $(container);
        options   = options || {};

        var showLabels = options.showLabels || false;
        var hideConfiguration = options.hideConfiguration || false;
        var actionLinkClickEvents = starterApp.PubSub();
        var focusTrap = getFocusTrap();

        render();

        return {
            onActionClick: subscribeToActionClick,
        };

        function render() {
            var ul = $('<ul></ul>').appendTo(container);
            if (! hideConfiguration) {
                ul.append(configTool());
            }
            ul.append(newTool());
            ul.append(openTool());
            ul.append(saveTool());
            ul.append(copyTool());
            ul.append(removeTool());
            ul.append(focusTrap);
        }

        function newTool() {
            return actionLink('new', 'new', 'file');
        }

        function saveTool() {
            return actionLink('save', 'save', 'save-file');
        }

        function copyTool() {
            return actionLink('duplicate', 'duplicate', 'duplicate');
        }

        function openTool() {
            return actionLink('open', 'open', 'folder-open');
        }

        function removeTool() {
            return actionLink('remove', 'remove', 'trash');
        }

        function configTool() {
            return actionLink('configure', 'configure', 'cog');
        }

        function getFocusTrap() {
            return $('<a href="#" class="focus_trap sr-only" aria-hidden="true" tabindex="-1"></a>');
        }

        // action link is just a link with an icon, and click events are published
        // to `actionLinkClickEvents`
        function actionLink(actionName, msgKey, glyphiconKey) {
            var msg = starterApp.util.escapeHTML(
                languageHandler.getMessage(msgKey));
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
    }
})(golab.tools.starterApp);
