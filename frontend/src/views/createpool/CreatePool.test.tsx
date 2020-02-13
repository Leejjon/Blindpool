import {fireEvent, render, waitForElement, waitForDomChange} from "@testing-library/react";
import React from "react";
import CreatePool from "./CreatePool";
// Wrap our components with MemoryRouter, otherwise the tests complain about the useHistory hook
import { MemoryRouter } from 'react-router-dom';
import fetchMock from "fetch-mock";
import './../../locales/i18n';

// Thank stackoverflow so much: https://stackoverflow.com/questions/58524183/how-to-mock-history-push-with-the-new-react-router-hooks-using-jest
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('Test CreatePool view', () => {
    afterAll(() => {
        fetchMock.restore();
        mockHistoryPush.mockClear();
    });

    test('Create pool with all fields empty - fail with enter a name message', async () => {
        const {getAllByText, getByText} = render(<MemoryRouter><CreatePool/></MemoryRouter>);
        const createPoolButton = getByText('CREATE POOL');
        expect(createPoolButton).toBeInTheDocument();
        fireEvent.click(createPoolButton);

        const emptyFieldMessages = await waitForElement(() => getAllByText('Please enter a name or remove this field'));
        expect(emptyFieldMessages.length).toBe(5);
    });

    test('Add a name field - new name field should be added', async () => {
        const {getAllByLabelText, getByLabelText} = render(<MemoryRouter><CreatePool/></MemoryRouter>);

        let emptyNameFields = getAllByLabelText(/^Player name /i);
        expect(emptyNameFields.length).toBe(5);

        const addPlayerButton = getByLabelText('Add another player');
        expect(addPlayerButton).toBeInTheDocument();
        fireEvent.click(addPlayerButton);

        emptyNameFields = await waitForElement(() => getAllByLabelText(/^Player name /i));
        expect(emptyNameFields.length).toBe(6);

        const newField = getByLabelText('Player name 6');
        expect(newField).toBeInTheDocument();

        // Check if the new field has gotten the focus.
        expect(newField).toBe(document.activeElement);
    });

    test('Remove the last name field - last name field should dissapear', async () => {
        const {getAllByLabelText, getByLabelText} = render(<MemoryRouter><CreatePool/></MemoryRouter>);

        let emptyNameFields = getAllByLabelText(/^Player name /i);
        expect(emptyNameFields.length).toBe(5);

        const removePlayer5Button = getByLabelText('Remove player 5');
        expect(removePlayer5Button).toBeInTheDocument();
        fireEvent.click(removePlayer5Button);

        emptyNameFields = await waitForElement(() => getAllByLabelText(/^Player name /i));
        expect(emptyNameFields.length).toBe(4);
    });

    test('Create a pool - Happy flow', async() => {
        fetchMock.mock('http://localhost:8080/api/v1/pool', {
            body: {key: 'ABC'},
            status: 200
        });

        const {getByText, getAllByLabelText, getByDisplayValue, container} = render(<MemoryRouter><CreatePool/></MemoryRouter>);
        const names = ['Leon', 'Dirk', 'Billy', 'Barry', 'Joop'];
        const createPoolButton = getByText('CREATE POOL');
        expect(createPoolButton).toBeInTheDocument();

        // Because no sane people can read regex, this is a simple startsWith expression.
        const nameFields = getAllByLabelText(/^Player name /i);
        nameFields.forEach((item, index) => {
            fireEvent.change(item,{ target: { value: names[index] } });
        });

        for (const name of names) {
            await waitForElement(() => getByDisplayValue(name));
        }

        // Verify if any error labels appeared, there should be none.
        for (let i = 0; i < names.length; i++) {
            expect(container.querySelector(`#nameField${i}-helper-text`)).toBeNull();
        }

        fireEvent.click(createPoolButton);

        // The line below makes sure the test doesn't start expecting the mockHistoryPush to be called before the async
        // code is done: https://testing-library.com/docs/dom-testing-library/api-async
        await waitForDomChange({container});

        // Verify the request to the backend was done.
        expect(fetchMock.called((url, opts) => {
            return opts.body === JSON.stringify(names) && url === 'http://localhost:8080/api/v1/pool';
        })).toBe(true);

        // The history.push(`/pool/${poolJson.key}`) call doesn't actually execute and navigate to the ViewPool
        // component as we didn't load the complete BrowserRouter in the unit test. It doesn't matter as the scope of
        // CreatePool.test.tsx is to only test CreatePool.tsx. So I mocked it with the mockHistoryPush.
        expect(mockHistoryPush).toHaveBeenCalledWith('/pool/ABC');
    });
});