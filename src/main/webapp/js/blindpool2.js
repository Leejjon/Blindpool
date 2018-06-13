let currentNumberOfPlayers = 5;
const PARTICIPANT_ROW = "participant";
const PARTICIPANT_NAME = "participantName";
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
    let removeParticipantMessage = MESSAGE_BUNDLE["remove.participant"];

    newParticipant.innerHTML = `<td>${nextId}</td>
        <td><div class="input-field" style="white-space:nowrap;"><input placeholder="Player ${nextId}" id="participantName${nextId}" type="text" class="validate"></div></td>
        <td><i class="material-icons" onclick="removeParticipant(${nextId})">remove_circle_outline</i></td>`;

    newParticipant.id = "participant" + nextId;

    // Place the new participant just above the addParticipantButton.
    let addParticipantButton = document.getElementById("addParticipantButtonRow");
    addParticipantButton.parentNode.insertBefore(newParticipant, addParticipantButton);

    currentNumberOfPlayers++;

    document.getElementById("participantName" + nextId).focus();
}
