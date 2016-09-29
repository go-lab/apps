(function(actionStatistics) {
    function escapeHTML(string) {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;'
        };

        string = '' + string;
        return string.replace(/[&<>"'\/]/g, function(c) {
            return entityMap[c];
        });
    }

    actionStatistics.util = {
        escapeHTML: escapeHTML
    };
})(golab.tools.actionStatistics);
