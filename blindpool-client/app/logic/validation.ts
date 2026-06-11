import type {ZodError} from "zod";
import type {Participant} from "~/model/Participant";

type CustomZodIssueParams = {
    params: Record<string, any> | undefined
}

export function applyParticipantValidations(
    error: ZodError<{freeFormatMatch?: string | undefined, participants: string[], selectedMatchID?: string | undefined}> | undefined,
    participants: Array<Participant>,
    ignoreEmptyFields: boolean = false
) {
    error?.issues.forEach((issue) => {
        if (issue.path.includes('participants')) {
            if (issue.code === 'invalid_format') {
                const participant = participants[issue.path[1] as number];
                if (participant.name) {
                    participants[issue.path[1] as number].valid = "ILLEGAL_CHARACTER_MESSAGE";
                } else {
                    if (!ignoreEmptyFields) {
                        participants[issue.path[1] as number].valid = "ILLEGAL_CHARACTER_MESSAGE";
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
                                    participant.valid = "DUPLICATE_MESSAGE";
                                } else {
                                    if (!ignoreEmptyFields) {
                                        participant.valid = "DUPLICATE_MESSAGE";
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    });
}
