const defaultNumberOfPlayers = 5;
let currentNumberOfPlayers = 5;
const PARTICIPANT_ROW = "participant";
const PARTICIPANT_NAME = "participantName";
const PARTICIPANT_REMOVE_BUTTON = "participantRemoveButton";

function getParticipants() {
    const empty = "";
    let participants = [];
    let i = 1;
    let participant = getParticipant(1);
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
    return document.getElementById(PARTICIPANT_NAME + id);
}

function addParticipant() {

}

function removeParticipant(id) {
    if (id > 0 && id <= currentNumberOfPlayers) {
        let participantRow = document.getElementById(PARTICIPANT_ROW + id);
        participantRow.parentNode.removeChild(participantRow);

        // Fix the id's of the other participants so there are no gaps.
        for (let i = id + 1; i <= currentNumberOfPlayers; i++) {
            let updatedId = i - 1;
            document.getElementById(PARTICIPANT_ROW + i).id = PARTICIPANT_ROW + updatedId;
            document.getElementById(PARTICIPANT_NAME + i).id = PARTICIPANT_NAME + updatedId;
            document.getElementById(PARTICIPANT_REMOVE_BUTTON + i).setAttribute('onclick',`removeParticipant(${updatedId})`);
            document.getElementById(PARTICIPANT_REMOVE_BUTTON + i).id = PARTICIPANT_REMOVE_BUTTON + updatedId
        }
        currentNumberOfPlayers--;
    } else {
        console.log("Tried to remove a participant with invalid id: " + id);
    }
}

function createPool() {
    try {
        let participants = getParticipants();
        postAjax("/pool/", participants, function (data) {
            loadCreatedPool(data);
        });
    } catch (error) {
        alert(error);
    }
}

function getPool() {
    try {
        var poolParam = getParameterByName("pool");
        if (poolParam != null) {
            getAjax("/pool/", poolParam, function (data) {
                loadRetrievedPool(data);
            });
        }
    } catch (error) {
        alert(error);
    }
}

/**
 * This function is being called after creating a pool.
 *
 * @param data
 */
function loadCreatedPool(data) {
    // According to the following page doing a simple if checks whether the data is null/undefined etc.
    // https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
    if (data != null && JSON.parse(data).key != null) {
        let poolData = JSON.parse(data);
        // For now, just redirect:
        let currentUrl = window.location.href;
        let queryString = '?pool=' + poolData.key;


        if (!currentUrl.endsWith(queryString)) {
            window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
        }
        // If this function was initiated from loading the page, it means the query parameter might already be there.
        // So only update the window history state if this method was called from the createPool function.
        // if (!currentUrl.endsWith(queryString)) {
        //     var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
        //     window.history.pushState({path:newUrl},'',newUrl);
        // }

        // TODO: Fill in the scores.
        showScoreColumns();
    }
}

function loadRetrievedPool(data) {
    if (data != null && JSON.parse(data).key != null) {

        showScoreColumns();
    }
}

function showScoreColumns() {
    var scoreColumns = document.getElementsByClassName("scoreColumn");
    for (var i = 0; i < scoreColumns.length; i++) {
        scoreColumns[i].style.display = "block";
    }
}

function getAjax(url, key, success) {
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    url = url + "?pool=" + key;
    xhr.open('GET', url, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
    xhr.onreadystatechange = function(){
        if (xhr.readyState > 3 && xhr.status == 200) {
            success(xhr.responseText);
        }
    }
}

function postAjax(url, participants, success) {
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status == 200) {
            success(xhr.responseText);
        }
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
    let url = window.location.href;
    parameterKey = parameterKey.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + parameterKey + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
