import {fireEvent, render, waitForElement} from "@testing-library/react";
import React from "react";
import CreatePool from "./CreatePool";
import { MemoryRouter } from 'react-router-dom';

import './../../locales/i18n';

describe('Test CreatePool view', () => {
    test('Create pool with all fields empty - fail with enter a name message', async () => {
        const {getAllByText, getByText} = render(<MemoryRouter><CreatePool/></MemoryRouter>);
        const createPoolButton = getByText('CREATE POOL');
        expect(createPoolButton).toBeInTheDocument();
        fireEvent.click(createPoolButton);

        const emptyFieldMessages = await waitForElement(() => getAllByText('Please enter a name or remove the field'));
        expect(emptyFieldMessages.length).toBe(5);
    });

    test('Create a pool - Happy flow', async() => {
        const names = ['Leejjon', 'Stofkat', 'Billy', 'Barry', 'Joop'];
        const {getByText, getAllByTestId, getByDisplayValue} = render(<MemoryRouter><CreatePool/></MemoryRouter>);
        const createPoolButton = getByText('CREATE POOL');
        expect(createPoolButton).toBeInTheDocument();

        // Because no sane people can read regex, this is a simple startsWith expression.
        const nameFields = getAllByTestId(/^nameInput/i);
        nameFields.forEach((item, index) => {
            fireEvent.change(item,{ target: { value: names[index] } });
        });

        for (const name of names) {
            await waitForElement(() => getByDisplayValue(name));
        }

        // TODO: Verify the outgoing http requests.
        // fireEvent.click(createPoolButton);
    });
});