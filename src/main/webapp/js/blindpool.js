var defaultNumberOfPlayers = 5;

function getParticipants() {
    var empty = "";
    var participants = [];
    var i = 1;
    var participant = getParticipant(1);
    for (; getParticipant(i) != null; participant = getParticipant(i)) {
        if (participant.value !== empty) {
            participants.push(participant.value);
            i++;
        } else {
            throw "Enter all fields! Number filled: " + (i - 1);
        }
    }
    return participants;
}

function getParticipant(id) {
    return document.getElementById("participantName" + id);
}

function createPool() {
    try {
        var participants = getParticipants();
        postAjax("/pool", participants, function (data) {
            loadPool(data);
        });
    } catch (error) {
        alert(error);
    }
}

/**
 * This function is being called after creating a pool.
 *
 * @param data
 */
function loadPool(data) {
    // According to the following page doing a simple if checks whether the data is null/undefined etc.
    // https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
    if (data) {
        var obj = JSON.parse(data);
        // For now, just redirect:
        var currentUrl = window.location.href;
        var queryString = '?pool=' + obj.key;
        window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;

        // If this function was initiated from loading the page, it means the query parameter might already be there.
        // So only update the window history state if this method was called from the createPool function.
        // if (!currentUrl.endsWith(queryString)) {
        //     var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
        //     window.history.pushState({path:newUrl},'',newUrl);
        // }

        // document.getElementById('createPoolButton').style.visibility = 'hidden';
        // TODO: Fill in the scores.
    }
}

function postAjax(url, participants, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(participants));
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
