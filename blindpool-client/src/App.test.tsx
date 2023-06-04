import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export function wrapper(children: React.ReactElement) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

test('See if anything renders at all', () => {
    // This will actually attempt to do network calls. But because it will find the text really fast it might not get to it.
    render(wrapper(<App/>));
    const linkElement = screen.getByText(/What is a blind pool/i);
    expect(linkElement).toBeInTheDocument();
});
