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

    // Reading participants and verifying if the field isn't empty.
    for (; getParticipant(i) != null; participant = getParticipant(i)) {
        if (participant.value !== empty) {

            // Check for duplicates.
            if (i > 1) {
                let otherParticipants = participants.slice(0, i - 1);
                let indexOfPossibleDuplicate = otherParticipants.indexOf(participant.value);
                if (indexOfPossibleDuplicate !== -1) {
                    showDuplicateParticipantError(i);
                    throw "duplicate.name";
                }
            }

            participants.push(participant.value);
            i++;
        } else {
            participant.classList.add("invalid");
            participant.focus();
            document.getElementById(PARTICIPANT_NAME_VALIDATION + i).style.display = "block";
            document.getElementById(PARTICIPANT_NAME_VALIDATION + i).setAttribute("data-error", MESSAGE_BUNDLE["enter.all.fields"]);
            throw "enter.all.fields";
        }
    }

    return participants;
}

function isDuplicateParticipantName(number) {
    let participant = getParticipant(number);

    let i = number;
    while (i > 1) {
        i--;
        let participantBefore = getParticipant(i);
        if (participant.value === participantBefore.value) {
            return true;
        }
    }
    return false;
}

function getParticipant(id) {
    return document.getElementById(PARTICIPANT_NAME + id);
}

function getParticipantRow(id) {
    return document.getElementById(PARTICIPANT_ROW + id);
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

function addNextParticipant(disableValidation) {
    let nextId = calculateNextId();
    let newParticipant = document.createElement("tr");
    let playerPlaceHolder = MESSAGE_BUNDLE["player.name.placeholder"];

    newParticipant.innerHTML = `<td id="numberColumn${nextId}" class="numberColumn"><label for="scoreField${nextId}">${nextId}</label></td>
        <td class="nameColumn"><div class="input-field input-phase-name-width" id="inputFieldDiv${nextId}">
            <input autocomplete="off" maxlength="16" required="required" placeholder="${playerPlaceHolder} ${nextId}" id="participantName${nextId}" type="text" class="validate" onblur="hideSolvedErrors(${nextId})" onkeyup="unselect(${nextId})">
            <span id="nameValidation${nextId}" class="helper-text nameValidation" data-error="Enter a valid name."  data-success="Correct, but this shouldn't be visible."></span>
        </div></td>
        <td class="scoreColumn"><div class="input-field"><input id="scoreField${nextId}" class="scoreColumn" autocomplete="off" type="text" value="" readonly="readonly"></div></td>
        <td class="iconColumn"><i id="participantRemoveButton${nextId}" class="material-icons" onclick="removeParticipant(${nextId})">remove_circle_outline</i></td>`;

    newParticipant.id = "participant" + nextId;

    // Place the new participant just above the addParticipantButton.
    let addParticipantButton = document.getElementById("addParticipantButtonRow");
    addParticipantButton.parentNode.insertBefore(newParticipant, addParticipantButton);

    currentNumberOfPlayers++;

    if (disableValidation) {
        document.getElementById("participantName" + nextId).classList.remove("validate");
    }

    document.getElementById("participantName" + nextId).focus();
}

function addDividerRow(participantRow) {
    let newDivider = document.createElement("tr");
    newDivider.innerHTML = `<td colspan="4"><div class="divider scoreDivider"></div></td>`;
    participantRow.parentNode.insertBefore(newDivider, participantRow);
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
            document.getElementById(PARTICIPANT_NAME + i).setAttribute("onfocus", `selectNumber(${updatedId})`);
            document.getElementById(PARTICIPANT_NAME + i).setAttribute("onblur", `unselect(${updatedId})`);
            document.getElementById(PARTICIPANT_NAME + i).setAttribute("placeholder", playerPlaceHolder + " " + updatedId);
            document.getElementById(PARTICIPANT_NAME + i).id = PARTICIPANT_NAME + updatedId;
            document.getElementById(PARTICIPANT_REMOVE_BUTTON + i).setAttribute("onclick",`removeParticipant(${updatedId})`);
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
        let languageOtherThanEnglish = null;
        if (window.location.hostname === "blindepool.nl" || window.location.hostname === "www.blindepool.nl") {
            languageOtherThanEnglish = "?lang=nl";
        }
        getAjax("/messages", languageOtherThanEnglish, function (data) {
            MESSAGE_BUNDLE = JSON.parse(data);
            getPool();
        });
    } catch (error) {
        alert(error);
    }
}

function getPool() {
    try {
        let poolParam = getParameterByName("pool");
        if (poolParam != null) {
            noRobotIndexing();
            getAjax("/pool/", "?pool=" + poolParam, function (data) {
                loadRetrievedPool(data);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

function createPool() {
    try {
        let participants = validateFields();
        disableCreatePoolButton();

        postAjax("/pool/", participants, function (data) {
            hideErrorLabel();
            loadCreatedPool(data);
        }, function () {
            showErrorLabel(MESSAGE_BUNDLE["server.error"]);
            enableCreatePoolButton();
        });
    } catch (error) {
        console.log(MESSAGE_BUNDLE[error]);
    }
}

function showErrorLabel(message) {
    document.getElementById("serverErrorLabel").style.display = "block";
    document.getElementById("serverErrorLabel").innerText = message;
}

function hideErrorLabel() {
    document.getElementById("serverErrorLabel").style.display = "none";
}

function disableCreatePoolButton() {
    let createPoolButton = document.getElementById("createPoolButton");
    createPoolButton.classList.add("disabled");
    createPoolButton.classList.remove("green");
    createPoolButton.classList.remove("accent-5");
}

function enableCreatePoolButton() {
    let createPoolButton = document.getElementById("createPoolButton");
    createPoolButton.classList.remove("disabled");
    createPoolButton.classList.add("green");
    createPoolButton.classList.add("accent-5");
    createPoolButton.style.marginTop = "1.5em";
}

function validateFields() {
    hideErrors();

    return getParticipants();
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

        noRobotIndexing(); // Is this necessary?
        let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
        window.history.pushState({path:newUrl},'',newUrl);

        for (let i = 0; i < scores.length; i++) {
            fillScoreColumn(scores[i], i);
        }
        showScoreColumns();
        hideNumbersAddAndRemoveButtons();
        updateCreatePoolButton();
        showShareUrlRows(poolData.key);
        updateTitleHeader();
    }
}

function loadRetrievedPool(data) {
    if (data != null && JSON.parse(data).key != null) {
        let poolData = JSON.parse(data);
        let participantsAndScores = poolData.participantsAndScores;

        createOrRemoveRows(participantsAndScores.length);

        for (let i = 0; i < participantsAndScores.length; i++) {
            fillNameColumn(participantsAndScores[i].participant.name, i);
            fillScoreColumn(participantsAndScores[i].score, i);
        }

        showScoreColumns();
        hideNumbersAddAndRemoveButtons();
        updateCreatePoolButton();
        showShareUrlRows(poolData.key);
        updateTitleHeader();
    } else if (data != null && JSON.parse(data).errorMessage != null) {
        showErrorLabel(MESSAGE_BUNDLE[JSON.parse(data).errorMessage]);
    } else {
        showErrorLabel(MESSAGE_BUNDLE["server.error"]);
    }
}

function updateTitleHeader() {
    let organizerLabel = document.getElementById("organizerLabel");
    organizerLabel.style.display = "block";
    // The first name entered is always the organizer of the pool.
    let organizerName = document.getElementById("participantName1").value;
    organizerLabel.innerText = MESSAGE_BUNDLE["owners.pool.title"].replace("{0}'", organizerName);
    organizerLabel.style.paddingTop = "10px";
}

function createOrRemoveRows(numberOfParticipants) {
    getParticipant(1).classList.remove("validate");

    let i;
    for (i = 2; i <= numberOfParticipants; i++) {
        let participantRow = document.getElementById(PARTICIPANT_ROW + i);
        if (participantRow === null) {
            addNextParticipant(true);
        }
    }

    while (document.getElementById(PARTICIPANT_ROW + i) !== null) {
        removeParticipant(i);
    }
}

function fillNameColumn(participantName, number) {
    document.getElementById(PARTICIPANT_NAME + (number + 1)).value = participantName;
}

function fillScoreColumn(score, number) {
    document.getElementById(SCORE_FIELD + (number + 1)).value = score.homeClubScore + " - " + score.awayClubScore;
}

function showScoreColumns() {
    let scoreColumns = document.getElementsByClassName("scoreColumn");
    for (let i = 0; i < scoreColumns.length; i++) {
        scoreColumns[i].style.display = "block";
    }
}

function showShareUrlRows(poolDataKey) {
    document.getElementById("shareDiv").style.display = "block";
    document.getElementById("shareButton").style.display = "block";
    document.getElementById("shareTitle").style.display = "block";

    let domain = MESSAGE_BUNDLE["domain"];
    document.getElementById("shareUrl").value = `https://${domain}/?pool=${poolDataKey}`;
}

function hideNumbersAddAndRemoveButtons() {
    let hostAndRemoveColumns = document.getElementsByClassName("iconColumn");
    for (let i = 0; i < hostAndRemoveColumns.length; i++) {
        // hostAndRemoveColumns[i].style.visibility = "hidden";
        hostAndRemoveColumns[i].style.display = "none";
    }
    let numberColumns = document.getElementsByClassName("numberColumn");
    for (let i = 0; i < numberColumns.length; i++) {
        numberColumns[i].style.visibility = "hidden";
    }

    let inputPhaseNameDivs = document.getElementsByClassName("input-phase-name-width");

    // Using a regular for loop fucks up because you're deleting elements in the array you're looping over.
    // I think lambdas are unreadable as fuck but this works while making a const list and doing a regular loop over it does not.
    const removeInputPhaseClass = (inputPhaseElementsListThatCanModify) => [...inputPhaseElementsListThatCanModify].forEach(inputPhaseNameDiv => {
        inputPhaseNameDiv.classList.remove("input-phase-name-width");
    });
    removeInputPhaseClass(inputPhaseNameDivs);

    let i = 1;
    let participant = getParticipant(i);
    for (; getParticipant(i) != null; participant = getParticipant(i)) {
        participant.setAttribute("readonly", "readonly");
        participant.removeAttribute("onkeyup");
        participant.removeAttribute("onblur")
        participant.classList.remove("validate");
        participant.classList.remove("valid");
        i++;
    }

    let j = 1;
    let participantRow = getParticipantRow(j);
    for (; getParticipantRow(j) != null; participantRow = getParticipantRow(j)) {
        addDividerRow(participantRow);
        j++;
    }

    document.getElementById("addParticipantButtonRow").style.display = "none";
}

function updateCreatePoolButton() {
    let newPoolButton = document.getElementById("createPoolButton");
    newPoolButton.removeAttribute("onclick");
    let newButtonMessage = MESSAGE_BUNDLE["make.another.pool.button"];
    newPoolButton.innerHTML = `<b>${newButtonMessage}</b>`;
    document.getElementById("createPoolButton").setAttribute("onclick", "toNewPool()");
    enableCreatePoolButton();
}

function toNewPool() {
    window.location.href = '/';
}

function toExistingPage(domain) {
    let newUrl = window.location.protocol + "//" + domain + '/' + window.location.search;
    window.location.href = newUrl;
}

function hideErrors() {
    let errorLabels = document.querySelectorAll('.nameValidation');

    for (let errorLabel of errorLabels) {
        errorLabel.style.display = "none";
    }
}

function showDuplicateParticipantError(number) {
    let input = document.getElementById(PARTICIPANT_NAME + number);
    input.classList.add("invalid");
    input.focus();
    document.getElementById(PARTICIPANT_NAME_VALIDATION + number).style.display = "block";
    document.getElementById(PARTICIPANT_NAME_VALIDATION + number).setAttribute("data-error", MESSAGE_BUNDLE["duplicate.name"]);
}

function hideSolvedErrors(number) {
    let input = document.getElementById(PARTICIPANT_NAME + number);
    if (input.value) {
        if (isDuplicateParticipantName(number)) {
            showDuplicateParticipantError(number);
        }
    }

    // TODO: On switching after fixing something, the green label doesn't dissapear.
    if (!input.classList.contains("invalid")) {
        document.getElementById(PARTICIPANT_NAME_VALIDATION + number).style.display = "none";
    }
}

function unselect(number) {
    document.getElementById(PARTICIPANT_NAME_VALIDATION + number).style.display = "none";

    let input = document.getElementById(PARTICIPANT_NAME + number);
    if (input.value.length > 0 && !isDuplicateParticipantName(number)) {
        input.classList.remove("invalid");
    }
}

function copyUrlToClipboard() {
    let input = document.getElementById("shareUrl");
    input.focus();
    input.setSelectionRange(0,99999);
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

function postAjax(url, participants, success, failure) {
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState > 3 && xhr.status === 200) {
            success(xhr.responseText);
        } else if (xhr.readyState > 3 && xhr.status >= 400) {
            failure();
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

function noRobotIndexing() {
    // Following: https://support.google.com/webmasters/answer/93710
    let noRobotsElement = document.createElement("meta");
    noRobotsElement.setAttribute("name", "robots");
    noRobotsElement.setAttribute("content", "noindex");
    document.getElementsByTagName('head')[0].appendChild(noRobotsElement);
}
