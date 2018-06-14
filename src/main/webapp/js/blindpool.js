let currentNumberOfPlayers = 4;
const PARTICIPANT_ROW = "participant";
const PARTICIPANT_NAME = "participantName";
const PARTICIPANT_NUMBER_COLUMN = "numberColumn";
const PARTICIPANT_REMOVE_BUTTON = "participantRemoveButton";
const PARTICIPANT_NAME_VALIDATION = "nameValidation";
const PARTICIPANT_INPUT_DIV = "inputFieldDiv";
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
            // The magic materialize framework will only start to detect whether a field is empty once it has been selected.
            // So we call the blur() function once to trigger materialize's detection that the field cannot be empty.
            // Of course the blur() implementation is clever enough to not do shit if there is no focus. So we focus() first.
            participant.focus();
            participant.blur();
            // Since blur() removes the focus, we trigger focus once again (sigh).
            participant.focus();
            document.getElementById(PARTICIPANT_NAME_VALIDATION + i).style.display = "block";
            document.getElementById(PARTICIPANT_NAME_VALIDATION + i).innerText = MESSAGE_BUNDLE["enter.all.fields"];
            document.getElementById(PARTICIPANT_NAME_VALIDATION + i).style.color = "red";
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
    let playerPlaceHolder = MESSAGE_BUNDLE["player.name.placeholder"];

    newParticipant.innerHTML = `<td id="numberColumn${nextId}" class="numberColumn">${nextId}</td>
        <td><div class="input-field" style="white-space:nowrap;">
            <input maxlength="16" required="required" placeholder="${playerPlaceHolder} ${nextId}" id="participantName${nextId}" type="text" class="validate" onblur="hideError(${nextId})">
            <span id="nameValidation${nextId}" class="helper-text nameValidation" data-error="Enter a valid name."  data-success="Correct, but this shouldn't be visible."></span>
        </div></td>
        <td><i id="participantRemoveButton${nextId}" class="material-icons" onclick="removeParticipant(${nextId})">remove_circle_outline</i></td>
        <td><input id="scoreField${nextId}" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></td>`;

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

        let playerPlaceHolder = MESSAGE_BUNDLE["player.name.placeholder"];

        // Fix the id's of the other participants so there are no gaps.
        for (let i = id + 1; i <= currentNumberOfPlayers; i++) {
            let updatedId = i - 1;
            document.getElementById(PARTICIPANT_NUMBER_COLUMN + i).innerHTML = updatedId;
            document.getElementById(PARTICIPANT_NUMBER_COLUMN + i).id = PARTICIPANT_NUMBER_COLUMN + updatedId;
            document.getElementById(PARTICIPANT_ROW + i).id = PARTICIPANT_ROW + updatedId;
            document.getElementById(PARTICIPANT_NAME + i).setAttribute('placeholder', playerPlaceHolder + " " + updatedId);
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

function loadPage() {
    try {
        getAjax("/messages/", null, function (data) {
            MESSAGE_BUNDLE = JSON.parse(data);
        });

        // getPool();
    } catch (error) {
        alert(error);
    }
}

function createPool() {
    try {
        let participants = validateFields();
        // postAjax("/pool/", participants, function (data) {
        //     loadCreatedPool(data);
        // });
    } catch (error) {
        console.log(MESSAGE_BUNDLE[error]);
    }
}

function validateFields() {
    hideErrors();

    let participants = getParticipants();

    for (participant of participants) {

    }

    return participants;
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

function hideErrors() {
    let errorLabels = document.querySelectorAll('.nameValidation');

    for (let errorLabel of errorLabels) {
        errorLabel.style.display = "none";
    }
}

function hideError(number) {
    document.getElementById(PARTICIPANT_NAME_VALIDATION + number).style.display = "none";
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
        if (xhr.readyState > 3 && xhr.status === 200) {
            success(xhr.responseText);
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(participants));
    return xhr;
}
