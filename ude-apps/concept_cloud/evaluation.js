var converter = require('json-2-csv');
var fs = require('fs');

/*
    required valid json format:
    {
        items : [
            "verb" : "something",
            "object" : {
                "etc" : "etc"
            },
            ...
        ]
    }
 */

var document = JSON.parse(fs.readFileSync('logs_pp1516_565c4ebe5b0838adb1b922e1.json', 'utf8')).items;

var options = {
    KEYS : [ 'verb', 'object.displayName', 'provider.inquiryPhase', 'actor.displayName', 'published', 'object.objectType', 'object.logSource', 'object.content', 'object.model', 'object.frequency', 'object.aggregatedView', 'object.color', 'object.contentType', 'object.concept'],
    DELIMITER : {
        FIELD :  "|",
        ARRAY :  ',',
        WRAP : "\""
    }
};

var json2csvCallback = function (err, csv) {

    if (err) throw err;
    fs.writeFile("logs_pp1516_2016-03-06-565c4ebe5b0838adb1b922e1.csv", csv, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
};


converter.json2csv(document, json2csvCallback, options);