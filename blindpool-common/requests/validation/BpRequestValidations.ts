import {Participant} from "../model/Participant";

export type BpRequestValidations = {
    participantValidations?: Array<Participant>;
    selectedMatchIdValidation?: "MATCH_ALREADY_STARTED";
    freeFormatMatchValidation?: "ILLEGAL_CHARACTER_MESSAGE";
    serverError?: boolean
}
