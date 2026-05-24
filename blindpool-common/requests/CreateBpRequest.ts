import { z } from "zod";

export const PARTICIPANT_REGEX = /^([a-zA-Z0-9 _]{1,20})$/;
export const FREE_FORMAT_REGEX = /^([-a-zA-Z0-9 ]{5,50})$/;

export const CreateBlindpoolRequestSchema = z.object({
    participants: z.array(z.string().regex(PARTICIPANT_REGEX)).min(1).refine(
        items => new Set(items).size === items.length,
        'Not allowed to have duplicate participant names.'
    ),
    selectedMatchID: z.string().optional(),
    freeFormatMatch: z.string().regex(FREE_FORMAT_REGEX).optional()
}).refine(
    data => data.selectedMatchID || data.freeFormatMatch,
    'Either enter a match or a free format.'
);

export type CreateBlindpoolRequestSchemaType = z.infer<typeof CreateBlindpoolRequestSchema>;
