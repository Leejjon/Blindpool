import {describe, expect, test} from "vitest";
import {validateParticipants} from "~/logic/validation";
import {
    CreateBlindpoolRequestSchema,
    type CreateBlindpoolRequestSchemaType
} from "blindpool-common/requests/CreateBpRequest";

describe('Test validation function', () => {
    test('Test if valid participants get valid: undefined', () => {
        const participants = ["Leon", "Sylvia", "Peter", "Inge", "Simone","Yvette", "Yde"];

        let formDataObject = {
            participants: participants,
            selectedMatchID: "some-match-id",
            freeFormatMatch: "undefined"
        } as CreateBlindpoolRequestSchemaType;

        const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);

        const validatedParticipants = validateParticipants(result, participants);
        expect(validatedParticipants.length).toBe(participants.length);
        validatedParticipants.forEach((participant) => {
            expect(participant.valid).toBeUndefined();
        })
    });
});
