import {IsOptional, IsString, Matches} from "class-validator";

export class CreateBlindpoolRequest {
    @IsString({each: true})
    @Matches(/^([a-zA-Z0-9 _]{1,20})$/, {each: true})
    participants: string[];

    @IsOptional()
    @IsString()
    selectedMatchID?: string

    @IsOptional()
    @IsString()
    @Matches(/^([a-zA-Z0-9 ]{5,50})$/)
    freeFormatMatch?: string;

    constructor(participants: string[], selectedMatch?: string, freeFormatMatch?: string) {
        this.participants = participants;
        this.selectedMatchID = selectedMatch;
        this.freeFormatMatch = freeFormatMatch
    }
}
