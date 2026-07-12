export interface Participant {
    name: string,
    valid?: ValidationError | undefined
}

export enum ValidationError {
    DUPLICATE_MESSAGE,
    ILLEGAL_CHARACTER_MESSAGE
}
