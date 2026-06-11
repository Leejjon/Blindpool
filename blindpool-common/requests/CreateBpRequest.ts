import { z } from "zod";

export const PARTICIPANT_REGEX = /^([a-zA-Z0-9 _]{1,20})$/;
export const FREE_FORMAT_REGEX = /^([-a-zA-Z0-9 ]{5,50})$/;
export const CREATE_BP_REQUEST_SCHEMA_VERSION = "duplicate-params-debug-1";

export const CreateBlindpoolRequestSchema = z.object({
    participants: z.array(z.string().regex(PARTICIPANT_REGEX)).min(1).superRefine((items, ctx) => {
        if (new Set(items).size !== items.length) {
            const seen = new Map<string, number[]>();
            items.forEach((item, index) => {
                const lower = item.toLowerCase();
                seen.set(lower, [...(seen.get(lower) || []), index]);
            });
            const duplicateIndexes = Array.from(seen.values())
                .filter(indexes => indexes.length > 1)
                .flat();
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Not allowed to have duplicate participant names.',
                params: {
                    type: 'duplicate_name',
                    duplicateIndexes,
                },
            });
        }
    }),
    selectedMatchID: z.string().optional(),
    freeFormatMatch: z.string().regex(FREE_FORMAT_REGEX).optional()
}).refine(
    data => data.selectedMatchID || data.freeFormatMatch,
    'Either enter a match or a free format.'
);

export type CreateBlindpoolRequestSchemaType = z.infer<typeof CreateBlindpoolRequestSchema>;
