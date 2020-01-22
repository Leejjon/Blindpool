import React from 'react';
import {fireEvent, render, waitForElement} from '@testing-library/react';
import App from './App';
import i18next from "i18next";
import './locales/i18n';

describe('Test home page in English', () => {
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