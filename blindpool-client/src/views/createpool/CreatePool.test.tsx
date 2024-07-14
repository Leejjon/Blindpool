import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import CreatePool from "./CreatePool";
import { MemoryRouter, useOutletContext } from 'react-router-dom';
import fetchMock from "fetch-mock";
import '../../locales/i18n';
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComponentWithBpContext, EMPTY_CONTEXT } from "../../test/ComponentWithBpContext";

// This const has to have a name starting with "mock". See: https://lukerogerson.medium.com/two-ways-to-fix-the-jest-test-error-the-module-factory-of-jest-mock-is-not-allowed-to-bf022b5175dd
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('Test CreatePool view', () => {

    afterEach(() => {
        fetchMock.restore();
        mockNavigate.mockClear();
    });

    test('Create pool with all fields empty - fail with enter a name message', async () => {
        const { findAllByText, getByText } = render(
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <ComponentWithBpContext context={EMPTY_CONTEXT}>
                        <CreatePool />
                    </ComponentWithBpContext>
                </QueryClientProvider>
            </HelmetProvider>
        );
        const createPoolButton = getByText('CREATE POOL');
        expect(createPoolButton).toBeInTheDocument();
        fireEvent.click(createPoolButton);

        const emptyFieldMessages = await findAllByText('Please enter a name or remove this field');
        expect(emptyFieldMessages.length).toBe(5);
    });

    test('Add a name field - new name field should be added', async () => {
        const { findAllByLabelText, getByLabelText } = render(
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <ComponentWithBpContext context={EMPTY_CONTEXT}>
                        <CreatePool />
                    </ComponentWithBpContext>
                </QueryClientProvider>
            </HelmetProvider>
        );

        let emptyNameFields = await findAllByLabelText(/^Player name /i);
        expect(emptyNameFields.length).toBe(5);

        const addPlayerButton = getByLabelText('Add another player');
        expect(addPlayerButton).toBeInTheDocument();
        fireEvent.click(addPlayerButton);

        emptyNameFields = await findAllByLabelText(/^Player name /i);
        expect(emptyNameFields.length).toBe(6);

        const newField = getByLabelText('Player name 6');
        expect(newField).toBeInTheDocument();

        // Check if the new field has gotten the focus.
        expect(newField).toBe(document.activeElement);
    });

    test('Remove the last name field - last name field should dissapear', async () => {
        const { findAllByLabelText, getByLabelText } = render(
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <ComponentWithBpContext context={EMPTY_CONTEXT}>
                        <CreatePool />
                    </ComponentWithBpContext>
                </QueryClientProvider>
            </HelmetProvider>
        );

        let emptyNameFields = await findAllByLabelText(/^Player name /i);
        expect(emptyNameFields.length).toBe(5);

        const removePlayer5Button = getByLabelText('Remove player 5');
        expect(removePlayer5Button).toBeInTheDocument();
        fireEvent.click(removePlayer5Button);

        emptyNameFields = await findAllByLabelText(/^Player name /i);
        expect(emptyNameFields.length).toBe(4);
    });

    // https://stackoverflow.com/questions/58524183/how-to-mock-history-push-with-the-new-react-router-hooks-using-jest
    test('Create a pool - Happy flow', async () => {
        fetchMock.post('http://localhost:8080/api/v3/pool', {
            body: { key: 'ABC' },
            status: 200
        });
        fetchMock.get('http://localhost:8082/api/v2/matches/upcoming?competition[]=2021', {
            body: [],
            status: 200
        });

        const { findByTestId, getAllByLabelText, findByDisplayValue, container } = render(
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <ComponentWithBpContext context={{ ...EMPTY_CONTEXT, competitionsToWatch: [2021] }}>
                        <CreatePool />
                    </ComponentWithBpContext>
                </QueryClientProvider>
            </HelmetProvider>
        );

        const containerHtmlElement = container as HTMLElement;
        const names = ['Leon', 'Dirk', 'Billy', 'Barry', 'Joop'];
        const createPoolButton = await findByTestId('createPoolButton');
        expect(createPoolButton).toBeInTheDocument();

        // Because no sane people can read regex, this is a simple startsWith expression.
        const nameFields = getAllByLabelText(/^Player name /i);
        nameFields.forEach((item, index) => {
            fireEvent.change(item, { target: { value: names[index] } });
        });

        for (const name of names) {
            await findByDisplayValue(name);
        }

        // Verify if any error labels appeared, there should be none.
        for (let i = 0; i < names.length; i++) {
            expect(container.querySelector(`#nameField${i}-helper-text`)).toBeNull();
        }

        fireEvent.click(createPoolButton);

        // The line below makes sure the test doesn't start expecting the mockHistoryPush to be called before the async
        // code is done: https://testing-library.com/docs/dom-testing-library/api-async
        // Had to replace waitForDomChange to waitFor
        await waitFor(() => {
            // Verify the request to the backend was done.
            expect(fetchMock.called((url, req): boolean => {
                if (url === 'http://localhost:8080/api/v3/pool' && req.body === JSON.stringify({ participants: names })) {
                    return true;
                } else {
                    return false;
                }
            })).toBe(true);


            // The history.push(`/pool/${poolJson.key}`) call doesn't actually execute and navigate to the ViewPool
            // component as we didn't load the complete BrowserRouter in the unit test. It doesn't matter as the scope of
            // CreatePool.test.tsx is to only test CreatePool.tsx. So I mocked it with the mockHistoryPush.
            expect(mockNavigate).toHaveBeenCalledWith('/pool/ABC');
        }, { container: containerHtmlElement });
    });

    test('Create a pool - No internet', async () => {
        fetchMock.post(
            'http://localhost:8080/api/v3/pool',
            Promise.reject('NetworkError when attempting to fetch resource.')
        ).get(
            'http://localhost:8082/api/v2/matches/upcoming?competition[]=2021', {
            body: [],
            status: 200
        });
        let messageState: string | undefined = undefined;

        const { getByText, getAllByLabelText, container } = render(
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <ComponentWithBpContext context={{...EMPTY_CONTEXT, setMessage: (message) => messageState = message}}>
                        <CreatePool />
                    </ComponentWithBpContext>
                </QueryClientProvider>
            </HelmetProvider>
        );

        const containerHtml = container as HTMLElement;
        const names = ['Leon', 'Dirk', 'Billy', 'Barry', 'Joop'];
        const createPoolButton = getByText('CREATE POOL');
        const nameFields = getAllByLabelText(/^Player name /i);
        nameFields.forEach((item, index) => {
            fireEvent.change(item, { target: { value: names[index] } });
        });

        // Leaving lots of validation out as it's already happening in the happy flow test.
        fireEvent.click(createPoolButton);
        await waitFor(() => {
            expect(messageState).toBe('BACKEND_UNREACHABLE');
        }, { container: containerHtml });
    });
});
