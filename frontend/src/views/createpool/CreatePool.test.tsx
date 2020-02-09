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

    test('Create a pool - Happy flow', async() => {
        fetchMock.mock('http://localhost:8080/api/v1/pool', {
            body: {key: 'ABC'},
            status: 200
        });

        const names = ['Leejjon', 'Stofkat', 'Billy', 'Barry', 'Joop'];
        const {getByText, getAllByTestId, getByDisplayValue, container} = render(<MemoryRouter><CreatePool/></MemoryRouter>);
        const createPoolButton = getByText('CREATE POOL');
        expect(createPoolButton).toBeInTheDocument();

        // Because no sane people can read regex, this is a simple startsWith expression.
        const nameFields = getAllByTestId(/^nameInput/i);
        nameFields.forEach((item, index) => {
            fireEvent.change(item,{ target: { value: names[index] } });
        });

        for (const name of names) {
            await waitForElement(() => getByDisplayValue(name));
            // TODO: Verify that the error label is empty.
        }

        // TODO: Verify the outgoing http requests.
        fireEvent.click(createPoolButton);

        // The line below makes sure the test doesn't start expecting the mockHistoryPush to be called before the async
        // code is done: https://testing-library.com/docs/dom-testing-library/api-async
        await waitForDomChange({container});

        // The history.push(`/pool/${poolJson.key}`) call doesn't actually execute and navigate to the ViewPool
        // component as we didn't load the complete BrowserRouter in the unit test. It doesn't matter as the scope of
        // CreatePool.test.tsx is to only test CreatePool.tsx. So I mocked it with the mockHistoryPush.
        expect(mockHistoryPush).toHaveBeenCalledWith('/pool/ABC');
    });
});