import fetchMock from "fetch-mock";
import ViewPool from "./ViewPool";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { render, waitFor } from "@testing-library/react";
import { ComponentWithBpContext, EMPTY_CONTEXT } from "../../test/ComponentWithBpContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('Test ViewPool', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    test('Load a pool with a custom match name', async () => {
        const playerNames = ["Leon", "Sylvia", "Peter", "Inge", "Simone", "Yvette", "Yde"];
        const customMatchName = "My match";
        fetchMock.get('http://localhost:8080/api/v2/pool/JE6znp9BvnP', {
            body: { 
                "key": "JEQ3KDXOJQl", 
                "PARTICIPANTS_AND_SCORES": [
                    { "score": { "away": 0, "home": 0 }, "participant": { "name": playerNames[0], "userType": 0 } }, 
                    { "score": { "away": -1, "home": -1 }, "participant": { "name": playerNames[1], "userType": 0 } }, 
                    { "score": { "away": 1, "home": 0 }, "participant": { "name": playerNames[2], "userType": 0 } }, 
                    { "score": { "away": 1, "home": 1 }, "participant": { "name": playerNames[3], "userType": 0 } }, 
                    { "score": { "away": 0, "home": 1 }, "participant": { "name": playerNames[4], "userType": 0 } }, 
                    { "score": { "away": 2, "home": 0 }, "participant": { "name": playerNames[5], "userType": 0 } }, 
                    { "score": { "away": 0, "home": 2 }, "participant": { "name": playerNames[6], "userType": 0 } }], 
                    "CREATED_TIMESTAMP": "2024-07-07T23:09:35.936Z", 
                    "FREE_FORMAT_MATCH": customMatchName
                },
            status: 200
        });

        const { findByText, getByText } = render(
            <HelmetProvider>
                {/* <MemoryRouter initialEntries={['/pool/JE6znp9BvnP']}>
                    <QueryClientProvider client={queryClient}>
                        <Routes>
                            <Route path="/pool/:key" element={<ViewPool />} />
                        </Routes>
                    </QueryClientProvider>
                </MemoryRouter> */}
                <QueryClientProvider client={queryClient}>
                    <ComponentWithBpContext context={EMPTY_CONTEXT} url="/pool/JE6znp9BvnP" urlWithPathParameterDefinition="/pool/:key">
                        <ViewPool />
                    </ComponentWithBpContext>
                </QueryClientProvider>
            </HelmetProvider>
        );
        expect(await findByText("My match")).toBeInTheDocument();
        playerNames.forEach((name) => {
            expect(getByText(name)).toBeInTheDocument();
        });
    });
});
