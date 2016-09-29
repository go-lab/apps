(function(conceptCloud) {
    conceptCloud.util = {
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

    /* Tag-Cloud Util */
    var ut = this.ut;
    var tools = ut.tools = ut.tools || {};
    var tag_cloud = tools.tag_cloud = tools.tag_cloud || {};
    var util = tag_cloud.util = {};

    util.find_all_key_values = function(obj, key) {
        var rval = [];

        key_values2(obj, rval);

        return rval;

        function key_values2(obj, rval) {
            if (Array.isArray(obj)) {
                var len = obj.length;

                for (var i=0; i<len; i++) {
                    key_values2(obj[i], rval);
                }
            }

            if (obj !== null && typeof(obj) === 'object') {
                for (var p in obj) {
                    if (p === key) {
                        rval.push(obj[p]);
                        continue;
                    }
                    key_values2(obj[p], rval);
                }
            }
        }
    };

    util.remove_duplicates = function(array) {
        var rval = [];
        var len = array.length;

        for (var i=0; i<len; i++) {
            var obj = array[i];

            if (rval.indexOf(obj) < 0)
                rval.push(obj);
        }

        return rval;
    };
})(golab.tools.conceptCloud);
