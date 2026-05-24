import {IsOptional, IsString, Matches} from "class-validator";
import {FREE_FORMAT_REGEX, PARTICIPANT_REGEX} from "./CreateBpRequest";

export class CreateBlindpoolRequest {
    @IsString({each: true})
    @Matches(PARTICIPANT_REGEX, {each: true})
    participants: string[];

    @IsOptional()
    @IsString()
    selectedMatchID?: string

    @IsOptional()
    @IsString()
    @Matches(FREE_FORMAT_REGEX)
    freeFormatMatch?: string;

    constructor(participants: string[], selectedMatch?: string, freeFormatMatch?: string) {
        this.participants = participants;
        this.selectedMatchID = selectedMatch;
        this.freeFormatMatch = freeFormatMatch
    }
}
