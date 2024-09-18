import { resources } from "./translations";
import { describe, expect, test } from "vitest";


describe('Resource bundle tests', () => {
    test('Verify if all keys are there in both the language bundles', () => {
        for (const [key] of Object.entries(resources.en.translation)) {
            expect(Object.prototype.hasOwnProperty.call(resources.nl.translation, key)).toBeTruthy();
        }
    });
});