let currentNumberOfPlayers = 4;
const PARTICIPANT_ROW = "participant";
const PARTICIPANT_NAME = "participantName";
const PARTICIPANT_NUMBER_COLUMN = "numberColumn";
const PARTICIPANT_REMOVE_BUTTON = "participantRemoveButton";
const SCORE_FIELD = "scoreField";
let MESSAGE_BUNDLE;

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
        <td><div class="input-field" style="white-space:nowrap;"><input placeholder="${playerPlaceHolder} ${nextId}" id="participantName${nextId}" type="text" class="validate"></div></td>
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
