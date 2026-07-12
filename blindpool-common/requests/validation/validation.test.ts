import {describe, expect, test} from "vitest";
import {DUPLICATE_MESSAGE, ILLEGAL_CHARACTER_MESSAGE} from "../model/Participant";
import {CreateBlindpoolRequestSchema, CreateBlindpoolRequestSchemaType} from "./CreateBpRequest";
import {validateParticipants} from "./validation";

describe('Test validation function', () => {
    test('Valid participants should have their valid property undefined', () => {
        const participants = ["Leon", "Sylvia", "Peter", "Inge", "Simone","Yvette", "Yde"];

        const formDataObject = {
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

    test('Participant with illegal character is marked as invalid', () => {
        const participants = ["Leon", "!llegal"];
        const formDataObject = {
            participants: participants,
            selectedMatchID: "some-match-id",
            freeFormatMatch: "undefined"
        } as CreateBlindpoolRequestSchemaType;

        const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);

        const validatedParticipants = validateParticipants(result, participants);
        expect(validatedParticipants.length).toBe(participants.length);
        const invalidParticipant = validatedParticipants[1]
        expect(invalidParticipant.valid).toBe(ILLEGAL_CHARACTER_MESSAGE);
    });

    test('Test if participant with empty name is marked as invalid when empty fields are not ignored', () => {
       const participants = ["Leon", ""];
        const formDataObject = {
            participants: participants,
            selectedMatchID: "some-match-id",
            freeFormatMatch: "undefined"
        } as CreateBlindpoolRequestSchemaType;

        const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);

        const validatedParticipants = validateParticipants(result, participants);
        expect(validatedParticipants.length).toBe(participants.length);
        const emptyParticipant = validatedParticipants[1];
        expect(emptyParticipant.valid).toBe(ILLEGAL_CHARACTER_MESSAGE);
    });


    test('Test if participant with empty name is not marked as invalid when empty fields are ignored', () => {
        const participants = ["Leon", ""];
        const formDataObject = {
            participants: participants,
            selectedMatchID: "some-match-id",
            freeFormatMatch: "undefined"
        } as CreateBlindpoolRequestSchemaType;

        const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);

        const validatedParticipants = validateParticipants(result, participants, true);
        expect(validatedParticipants.length).toBe(participants.length);
        const emptyParticipant = validatedParticipants[1];
        expect(emptyParticipant.valid).toBeUndefined();
    });

    test('Participants with the same name should have the valid property marked as duplicate', () => {
        const participants = ["Duplicate", "Duplicate"];
        const formDataObject = {
            participants: participants,
            selectedMatchID: "some-match-id",
            freeFormatMatch: "undefined"
        } as CreateBlindpoolRequestSchemaType;

        const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);

        const validatedParticipants = validateParticipants(result, participants);
        expect(validatedParticipants.length).toBe(participants.length);
        const duplicatedParticipant1 = validatedParticipants[0];
        const duplicatedParticipant2 = validatedParticipants[1];
        expect(duplicatedParticipant1.valid).toBe(DUPLICATE_MESSAGE);
        expect(duplicatedParticipant2.valid).toBe(DUPLICATE_MESSAGE);
    });

    test('Two participants that are both empty, should get marked as duplicate', () => {
        const participants = ["", ""];
        const formDataObject = {
            participants: participants,
            selectedMatchID: "some-match-id",
            freeFormatMatch: "undefined"
        } as CreateBlindpoolRequestSchemaType;

        const result = CreateBlindpoolRequestSchema.safeParse(formDataObject);

        const validatedParticipants = validateParticipants(result, participants);
        expect(validatedParticipants.length).toBe(participants.length);
        const duplicatedParticipant1 = validatedParticipants[0];
        const duplicatedParticipant2 = validatedParticipants[1];
        expect(duplicatedParticipant1.valid).toBe(DUPLICATE_MESSAGE);
        expect(duplicatedParticipant2.valid).toBe(DUPLICATE_MESSAGE);
    })
});
