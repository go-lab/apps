export function extractUrlParts(url) {
    var location = {};
    var queryString;
    var indexOfParams;

    url = stripLeadingPound(url);
    indexOfParams = url.indexOf('?');

    if (indexOfParams < 0) {
        location.path = url;
        location.queryParameters = {};
    } else {
        location.path = url.substr(0, indexOfParams);
        queryString = url.substr(indexOfParams + 1);
        location.queryParameters = extractParams(queryString);
    }

    return location;
}

function stripLeadingPound(string) {
    if (string.charAt(0) === '#') {
        string = string.substr(1);
    }
    return string;
}

function extractParams(queryString) {
    var indexOfEquals, key, value;
    return queryString.split('&').reduce((params, pair) => {
        if (pair === '') return params;
        indexOfEquals = pair.indexOf('=');
        if (indexOfEquals > -1) {
            key = pair.substr(0, indexOfEquals);
            value = pair.substr(indexOfEquals + 1);
            if (key === '') return params;
        } else {
            key = pair;
            value = '';
        }
        params[key] = value;
        return params;
    }, {});
}

export function composeUrlParts(path, params) {
    var paramString = Object.keys(params).reduce((paramString, key) => {
        if (paramString === '') {
            paramString = '?';
        } else {
            paramString += '&';
        }
        return paramString += `${key}=${params[key]}`;
    }, '');

    return path + paramString;
}
