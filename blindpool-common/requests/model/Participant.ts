export interface Participant {
    name: string,
    valid?: "DUPLICATE_MESSAGE" | "ILLEGAL_CHARACTER_MESSAGE" | undefined
}

export const DUPLICATE_MESSAGE = "DUPLICATE_MESSAGE";
export const ILLEGAL_CHARACTER_MESSAGE = "ILLEGAL_CHARACTER_MESSAGE";

