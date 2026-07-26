import type {ZodSafeParseResult} from "zod";
import {DUPLICATE_MESSAGE, ILLEGAL_CHARACTER_MESSAGE, type Participant} from "../model/Participant";

type CustomZodIssueParams = {
    params: Record<string, any> | undefined
}

function mapToValidParticipant(participant: string): Participant {
    return Object.assign({}, {name: participant, valid: undefined});
}

export function validateParticipants(
    result: ZodSafeParseResult<{
        participants: string[];
        freeFormatMatch: string;
        selectedMatchID?: string | undefined;
    }>,
    participantNames: Array<string>,
    ignoreEmptyFields: boolean = false
): Array<Participant> {
    let participants = participantNames.map(mapToValidParticipant);
    result.error?.issues.forEach((issue) => {
        if (issue.path.includes('participants')) {
            if (issue.code === 'invalid_format') {
                const participant = participants[issue.path[1] as number];
                if (participant.name) {
                    participants[issue.path[1] as number].valid = ILLEGAL_CHARACTER_MESSAGE;
                } else {
                    if (!ignoreEmptyFields) {
                        participants[issue.path[1] as number].valid = ILLEGAL_CHARACTER_MESSAGE;
                    }
                }
            } else if (issue.code === 'custom') {
                const participantsIssueAsAny = issue as CustomZodIssueParams;
                if (participantsIssueAsAny.params && participantsIssueAsAny.params.type === 'duplicate_name' && participantsIssueAsAny.params.duplicateIndexes) {
                    const duplicateIndexes: Array<number> = participantsIssueAsAny.params.duplicateIndexes;
                    if (duplicateIndexes) {
                        participants.forEach((_, index) => {
                            const indexOfParticipantThatHasDuplicateValue = duplicateIndexes.find((participant: number) => participant === index);
                            if (indexOfParticipantThatHasDuplicateValue !== undefined) {
                                const participant = participants[indexOfParticipantThatHasDuplicateValue]
                                if (participant.name) {
                                    participant.valid = DUPLICATE_MESSAGE;
                                } else {
                                    if (!ignoreEmptyFields) {
                                        participant.valid = DUPLICATE_MESSAGE;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    });
    return participants;
}

export function validateFreeFormatMatch(
    result: ZodSafeParseResult<{
        participants: string[];
        freeFormatMatch: string;
        selectedMatchID?: string | undefined;
    }>,
) {
    for (const issue of result.error?.issues ?? []) {
        if (issue.path.includes('freeFormatMatch')) {
            if (issue.code === 'custom' && issue.message === "Invalid free format match.") {
                return "ILLEGAL_CHARACTER_MESSAGE";
            }
        }
    }
    return undefined;
}
