import {IsOptional, IsString, Matches} from "class-validator";
import { z } from "zod";

export class CreateBlindpoolRequest {
    @IsString({each: true})
    @Matches(/^([a-zA-Z0-9 _]{1,20})$/, {each: true})
    participants: string[];

    @IsOptional()
    @IsString()
    selectedMatchID?: string

    @IsOptional()
    @IsString()
    @Matches(/^([-a-zA-Z0-9 ]{5,50})$/)
    freeFormatMatch?: string;

    constructor(participants: string[], selectedMatch?: string, freeFormatMatch?: string) {
        this.participants = participants;
        this.selectedMatchID = selectedMatch;
        this.freeFormatMatch = freeFormatMatch
    }
}

export const CreateBlindpoolRequestSchema = z.object({
    participants: z.array(z.string().regex(/^([a-zA-Z0-9 _]{1,20})$/)),
    selectedMatchID: z.string().optional(),
    freeFormatMatch: z.string().regex(/^([-a-zA-Z0-9 ]{5,50})$/).optional()
}).refine(
    data => data.selectedMatchID || data.freeFormatMatch,
    'Either enter a match or a free format.'
);

export type CreateBlindpoolRequestSchemaType = z.infer<typeof CreateBlindpoolRequestSchema>;