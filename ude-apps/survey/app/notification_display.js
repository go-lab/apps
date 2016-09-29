(function(ReflectionPoll) {
    ReflectionPoll.NotificationDisplay = NotificationDisplay;

    function NotificationDisplay(container) {
        container = $(container);
        var textContainer = container.find('.panel-body');

        return {
            display: display
        };

        function display(notification) {
            var notificationText = $('<p></p>').text(notification.content.text);

            textContainer.html(notificationText);
            container.fadeIn();

            setTimeout(function() {
                container.fadeOut();
            }, 3000);
        }
    }
})(golab.tools.ReflectionPoll);
