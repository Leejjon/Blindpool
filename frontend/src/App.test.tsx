import React from 'react';
import {fireEvent, render, waitForElement} from '@testing-library/react';
import App from './App';
import i18next from "i18next";
import './locales/i18n';

describe('Test home page in English', () => {
    beforeAll(() => {
        i18next.changeLanguage('en');
    });

    test('Verify page title', () => {
        const {getByText} = render(<App/>);
        const cardTitle = getByText('What is a blind pool?');
        expect(cardTitle).toBeInTheDocument();
        expect(cardTitle.tagName).toMatch('H2');
    });
});

describe('Test home page in Dutch', () => {
    beforeAll(() => {
        i18next.changeLanguage('nl');
    });

    test('Verify home page content', async () => {
        const {getByText} = render(<App/>);
        const cardTitle = getByText('Wat is een blindepool?');
        expect(cardTitle).toBeInTheDocument();
        expect(cardTitle.tagName).toMatch('H2');
    });
});

describe('Test navigation', () => {
    beforeAll(() => {
        i18next.changeLanguage('en');
    });

    test('Navigate to create page', async () => {
        const {getByText} = render(<App/>);
        const createButton: HTMLSpanElement = getByText('Create pool');
        expect(createButton).toBeInTheDocument();

        fireEvent.click(createButton);
        const createPoolTitle = await waitForElement(() => getByText('Create pool'));
        expect(createPoolTitle).toBeInTheDocument();
        expect(createPoolTitle.tagName).toMatch('H2');
    });
});