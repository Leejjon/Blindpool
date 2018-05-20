function createPool() {
    postAjax("/pool", "blabla", function (data) {
        loadPool(data);
    })
}

/**
 * This function is being called when loading the page and after creating a pool.
 *
 * @param data
 */
function loadPool(data) {
    // According to the following page doing a simple if checks whether the data is null/undefined etc.
    // https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
    if (data) {
        var currentUrl = window.location.href;
        var queryString = '?pool=' + data;
        // If this function was initiated from loading the page, it means the query parameter might already be there.
        // So only update the window history state if this method was called from the createPool function.
        if (!currentUrl.endsWith(queryString)) {
            var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
            window.history.pushState({path:newUrl},'',newUrl);
        }
        // TODO: Fill in the scores.
    }
}

function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}

/**
 * I have no clue what the regex does. Stolen from:
 * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 *
 * @param parameterKey
 * @returns {*} Null, '' or the query parameter value.
 */
function getParameterByName(parameterKey) {
    var url = window.location.href;
    parameterKey = parameterKey.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + parameterKey + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
