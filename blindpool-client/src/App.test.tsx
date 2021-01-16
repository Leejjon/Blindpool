import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import App from './App';
import i18next from "i18next";
import './locales/i18n';
import fetchMock from "fetch-mock";
import {act} from "react-dom/test-utils";

describe('Test home page in English', () => {
    beforeAll(() => {
        i18next.changeLanguage('en');
    });

    afterEach(() => {
        fetchMock.restore();
    });

    test('Verify page title', async() => {
        fetchMock.mock('http://localhost:8082/api/v2/matches/upcoming', {
            body: [],
            status: 200
        });

        await act(async () => {
            const {getByText} = render(<App/>);
            const cardTitle = getByText('What is a blind pool?');
            expect(cardTitle).toBeInTheDocument();
            expect(cardTitle.tagName).toMatch('H2');
        });
    });
});

describe('Test home page in Dutch', () => {
    beforeAll(() => {
        i18next.changeLanguage('nl');
    });

    afterEach(() => {
        fetchMock.restore();
    });

    test('Verify home page content', async () => {
        fetchMock.mock('http://localhost:8082/api/v2/matches/upcoming', {
            body: [],
            status: 200
        });

        await act(async () => {
            const {getByText} = render(<App/>);
            const cardTitle = getByText('Wat is een blindepool?');
            expect(cardTitle).toBeInTheDocument();
            expect(cardTitle.tagName).toMatch('H2');
        });
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
        await waitFor(() => {
            const createPoolTitle = getByText('Create pool');
            expect(createPoolTitle).toBeInTheDocument();
            expect(createPoolTitle.tagName).toMatch('H2');
        });
    });
});