export default function LoadingIndicator(element, options = {}) {
    var setInterval = options.setInterval || window.setInterval;
    var interval    = options.interval || 600;
    var maxDots     = options.maxDots  || 3;
    var text        = element.textContent;
    var cycleCount  = 0;

    cycle();

    var intervalId = setInterval(cycle, interval);

    return {
        stop: function() {
            clearInterval(intervalId);
            element.textContent = text;
        }
    };

    function cycle() {
        var dots = getDots();
        element.textContent = text + dots;
        cycleCount++;
    }

    function getDots() {
        var dotCount = (cycleCount % maxDots) + 1;
        var dots = '';
        for (var i = 1; i <= dotCount; i++) dots += '.';
        return dots;
    }
}
