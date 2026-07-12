import { describe, it, expect } from 'vitest';
import {CreateBlindpoolRequestSchema} from './CreateBpRequest.js';

describe('CreateBlindpoolRequestSchema', () => {
    it('should return duplicate_name error with indexes of duplicate participants', () => {
        const result = CreateBlindpoolRequestSchema.safeParse({
            participants: ['Alice', 'Bob', 'Alice', 'Charlie', 'Bob'],
            freeFormatMatch: 'Some match name',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const participantsIssue = result.error.issues.find(
                issue => issue.path.includes('participants')
            );
            expect(participantsIssue).toBeDefined();
            expect(participantsIssue!.message).toBe('Not allowed to have duplicate participant names.');
            expect((participantsIssue as any).params).toEqual({
                type: 'duplicate_name',
                duplicateIndexes: [0, 2, 1, 4],
            });
        }
    });

    it('should not return duplicate_name error when all participants are unique', () => {
        const result = CreateBlindpoolRequestSchema.safeParse({
            participants: ['Alice', 'Bob', 'Charlie'],
            freeFormatMatch: 'Some match name',
        });

        expect(result.success).toBe(true);
    });

    it('should fail when freeFormatMatch has an illegal character and no selectedMatchID is provided', () => {
        const result = CreateBlindpoolRequestSchema.safeParse({
            participants: ['Alice', 'Bob', 'Charlie'],
            freeFormatMatch: 'Ecuador vs Curaçao',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const freeFormatIssue = result.error.issues.find(
                issue => issue.path.includes('freeFormatMatch')
            );
            expect(freeFormatIssue).toBeDefined();
            expect(freeFormatIssue.code).toBe('custom');
        }
    });

    it('should pass when freeFormatMatch has an illegal character but a valid selectedMatchID is provided', () => {
        const result = CreateBlindpoolRequestSchema.safeParse({
            participants: ['Alice', 'Bob', 'Charlie'],
            selectedMatchID: 'football-data-285418',
            freeFormatMatch: 'Ecuador vs Curaçao',
        });

        expect(result.success).toBe(true);
    });
});
