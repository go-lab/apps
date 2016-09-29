function Toolbar(container, languageHandler, options) {
    container = $(container);
    options   = options || {};

    var showLabels = options.showLabels || false;
    var actionLinkClickEvents = PubSub();
    var focusTrap = getFocusTrap();

    render();

    return {
        onActionClick: subscribeToActionClick
    };

    function render() {
        var ul = $('<ul></ul>').appendTo(container);
        ul.append(refreshData());
        ul.append(focusTrap);
    }

    function refreshData() {
        return actionLink('refresh', 'refresh', 'refresh');
    }


    function getFocusTrap() {
        return $('<a href="#" class="focus_trap sr-only" aria-hidden="true"></a>');
    }

    // action link is just a link with an icon, and click events are published
    // to `actionLinkClickEvents`
    function actionLink(actionName, msgKey, glyphiconKey) {
        var msg = escapeHTML(languageHandler.getMessage(msgKey));
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
