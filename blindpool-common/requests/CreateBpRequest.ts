import { z } from "zod";

export const PARTICIPANT_REGEX = /^([a-zA-Z0-9 _]{1,20})$/;
export const FREE_FORMAT_REGEX = /^([-a-zA-Z0-9 ]{5,50})$/;
export const CREATE_BP_REQUEST_SCHEMA_VERSION = "duplicate-params-debug-3";

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
                code: "custom",
                message: 'Not allowed to have duplicate participant names.',
                params: {
                    type: 'duplicate_name',
                    duplicateIndexes,
                },
            });
        }
    }),
    selectedMatchID: z.string().optional(),
    freeFormatMatch: z.string()
}).superRefine((data, ctx) => {
    /* I dislike this code and took the time to explain it. The freeFormatMatch field will contain either:
     * - A custom match name
     * - The match title of the match in the selectedMatchID field
     *
     * This is because we use a form, and our Autocomplete component is used to select an existing match or enter a
     * custom match name.
     *
     * When typing a custom name, I only want regular characters, so people can't attempt cross-site scripting or other
     * kinds of command injection.
     *
     *
     */
    if (!data.selectedMatchID && !FREE_FORMAT_REGEX.test(data.freeFormatMatch)) {
        ctx.addIssue({
            code: "custom",
            message: 'Invalid free format match.',
            path: ['freeFormatMatch'],
        });
    }
});

export type CreateBlindpoolRequestSchemaType = z.infer<typeof CreateBlindpoolRequestSchema>;
