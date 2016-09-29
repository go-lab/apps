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
        ul.append(aggregation());
        ul.append(evolution());
        ul.append(focusTrap);
    }

    function aggregation(){
        return actionLink('aggregation', 'aggregation', 'globe');
    }

    function refreshData() {
        return actionLink('refresh', 'refresh', 'refresh');
    }

    function evolution() {
        return actionLink('evolution', 'evolution', 'apple');
    }

    function getFocusTrap() {
        return $('<a href="#" class="focus_trap sr-only" aria-hidden="true"></a>');
    }

    // action link is just a link with an icon, and click events are published
    // to `actionLinkClickEvents`
    function actionLink(actionName, msgKey, glyphiconKey) {
        var msg = escapeHTML(languageHandler.getMessage(msgKey));
        var link1 = $('<a href="#"></a>').append($('<span aria-hidden="true" class="glyphicon glyphicon-' + glyphiconKey + '"></span>'));
        if(glyphiconKey === "apple"){
          //  var link1 = $('<a href="#"></a>').append($('<span aria-hidden="true" class="glyphicon glyphicon-' + glyphiconKey + '">Evolution</span>'));
            var link1 = $('<a class="to-evolution" href="#"></a>').append($(' <i class="fa fa-1x fa-line-chart" > Evolution</i>'));
        }
        if(glyphiconKey === "globe"){
            var link1 = $('<a class="to-aggregation active" href="#"></a>').append($('<span aria-hidden="true" class="glyphicon glyphicon-' + glyphiconKey + '">Aggregation</span>'));

        }


        if (showLabels) {
            link1.append(' ' + msg);
        } else {
            link1.attr('title', msg);
        }

        var item1 = $('<li></li>').append(link1);

        item1.on('click', function(event) {
            event.preventDefault();
            actionLinkClickEvents.publish(actionName);
            focusTrap.focus();
        });

        return item1;
    }

    function subscribeToActionClick(actionName, handler) {
        actionLinkClickEvents.subscribe(function(clickedAction) {
            if (clickedAction === actionName) {
                handler.apply(null, Array.prototype.slice.call(arguments, 1));
            }
        });
    }
}
