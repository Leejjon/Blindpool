const defaultNumberOfPlayers = 5;
let currentNumberOfPlayers = 5;
const PARTICIPANT_ROW = "participant";
const PARTICIPANT_NAME = "participantName";
const PARTICIPANT_REMOVE_BUTTON = "participantRemoveButton";
const SCORE_FIELD = "scoreField";
let MESSAGE_BUNDLE;

function getParticipants() {
    const empty = "";
    let participants = [];
    let i = 1;
    let participant = getParticipant(i);
    for (; getParticipant(i) != null; participant = getParticipant(i)) {
        if (participant.value !== empty) {
            participants.push(participant.value);
            i++;
        } else {
            participant.focus();
            throw "enter.all.fields";
        }
    }
    return participants;
}

function getParticipant(id) {
    return document.getElementById(PARTICIPANT_NAME + id);
}

function calculateNextId() {
    // First calculate what the next id needs to be.
    let i = 1;
    let participant = getParticipant(i);
    for (; participant != null; participant = getParticipant(i)) {
        i++;
    }
    return i;
}

function addNextParticipant() {
    let nextId = calculateNextId();
    let newParticipant = document.createElement("tr");
    let removeParticipantMessage = MESSAGE_BUNDLE["remove.participant"];
    newParticipant.innerHTML = `<td><input id="participantName${nextId}" class="nameInput" autocomplete="off" type="text" value=""></td>
                                <td><input id="scoreField${nextId}" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></td>
                                <td><button class="hostAndRemoveColumn" tabindex="-1" id="participantRemoveButton${nextId}" onclick="removeParticipant(${nextId})">${removeParticipantMessage}</button></td>`;
    newParticipant.id = "participant" + nextId;

    // Place the new participant just above the addParticipantButton.
    let addParticipantButton = document.getElementById("addParticipantButtonRow");
    addParticipantButton.parentNode.insertBefore(newParticipant, addParticipantButton);

    currentNumberOfPlayers++;

    document.getElementById("participantName" + nextId).focus();
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
            document.getElementById(SCORE_FIELD + i).id = SCORE_FIELD + updatedId;
        }
        currentNumberOfPlayers--;
    } else {
        console.log("Tried to remove a participant with invalid id: " + id);
    }
}

function createPool() {
    hideError();
    try {
        let participants = validateFields();
        postAjax("/pool/", participants, function (data) {
            loadCreatedPool(data);
        });
    } catch (error) {
        showError(MESSAGE_BUNDLE[error]);
    }
}

function validateFields() {
    hideError();

    let participants = getParticipants();

    let sortedParticipants = participants.slice().sort(); // You can define the comparing function here.
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (var i = 0; i < sortedParticipants.length - 1; i++) {
        if (sortedParticipants[i + 1] === sortedParticipants[i]) {
            results.push(sortedParticipants[i]);
        }
    }

    console.log(results);
    return participants;
}

function loadPage() {
    try {
        getAjax("/messages/", null, function (data) {
            MESSAGE_BUNDLE = JSON.parse(data);
        });

        getPool();
    } catch (error) {
        alert(error);
    }
}

function getPool() {
    try {
        let poolParam = getParameterByName("pool");
        if (poolParam != null) {
            getAjax("/pool/", "?pool=" + poolParam, function (data) {
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
        let queryString = '?pool=' + poolData.key;
        let scores = poolData.scores;

        // if (!currentUrl.endsWith(queryString)) {
        //     window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
        // }

        let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
        window.history.pushState({path:newUrl},'',newUrl);

        fillScoreColumns(scores);
        showScoreColumns();
        hideHostAddAndRemoveButtons();
        showShareUrlRows(poolData.key);

        // TODO: Update title header.
        updateTitleHeader();
    }
}

function loadRetrievedPool(data) {
    if (data != null && JSON.parse(data).key != null) {
        let poolData = JSON.parse(data);
        let participantsAndScores = poolData.participantsAndScores;
        console.log(participantsAndScores.length);

        // TODO: Fill fields in page with data from json request.

        showScoreColumns();
        showShareUrlRows();
    } else if (data != null && JSON.parse(data).errorMessage != null) {
        showError(MESSAGE_BUNDLE[JSON.parse(data).errorMessage]);
    }
}

function showError(id, error) {
    let errorMessageLabel = document.getElementById("errorMessage");
    errorMessageLabel.style.display = "block";
    errorMessageLabel.innerHTML = error;
}

function hideError() {
    let errorMessageLabel = document.getElementById("errorMessage");
    errorMessageLabel.style.display = "none";
    errorMessageLabel.innerHTML = "";
}

function fillScoreColumns(scores) {
    for (let i = 0; i < scores.length; i++) {
        document.getElementById(SCORE_FIELD + (i + 1)).value = scores[i].homeClubScore + "-" + scores[i].awayClubScore;
    }
}

function showScoreColumns() {
    let scoreColumns = document.getElementsByClassName("scoreColumn");
    for (let i = 0; i < scoreColumns.length; i++) {
        scoreColumns[i].style.display = "block";
    }
}

function showShareUrlRows(poolDataKey) {
    let shareRows = document.getElementsByClassName("shareRow");
    for (let i = 0; i < shareRows.length; i++) {
        shareRows[i].style.display = "block";
    }
    document.getElementById("shareUrl").value = `https://blindpool.com/?pool=${poolDataKey}`;
}

function hideHostAddAndRemoveButtons() {
    let hostAndRemoveColumns = document.getElementsByClassName("hostAndRemoveColumn");
    for (let i = 0; i < hostAndRemoveColumns.length; i++) {
        hostAndRemoveColumns[i].style.display = "none";
    }
    document.getElementById("addParticipantButton").style.display = "none";
}

function updateTitleHeader() {
    // The first name entered is always the organizer of the pool.
    let organizerName = document.getElementById("participantName1").value;
    document.getElementById("titleHeader").innerHTML = MESSAGE_BUNDLE["owners.pool.title"].replace("{0}'", organizerName);
}

function copyUrlToClipboard() {
    var shareUrl = document.getElementById("shareUrl");
    shareUrl.select();
    document.execCommand("copy");
}

function getAjax(url, param, success) {
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    if (param != null) {
        url = url + param;
    }

    xhr.open('GET', url, true);
    xhr.send(null);
    xhr.onreadystatechange = function(){
        if (xhr.readyState > 3 && (xhr.status === 200 || xhr.status === 404)) {
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
