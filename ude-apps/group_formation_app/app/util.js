(function(starterApp) {
    starterApp.util = {
        escapeHTML: escapeHTML,
        formatDate: formatDate,
    };

    function escapeHTML(string) {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
        };

        string = '' + string;
        return string.replace(/[&<>"'\/]/g, function(c) {
            return entityMap[c];
        });
    }

    function formatDate(date, format) {
        return moment(date).format(format);
    }
})(golab.tools.starterApp);
