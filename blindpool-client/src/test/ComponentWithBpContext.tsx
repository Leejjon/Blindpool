import { ReactNode } from 'react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import { BpOutletContext } from '../context/BpContext';

interface ComponentWithBpContextProps {
  context: BpOutletContext;
  children: ReactNode;
  url?: string;
  urlWithPathParameterDefinition?: string;
}

// This solution is inspired on the first answer on this stack overflow post: https://stackoverflow.com/questions/70507413/react-router-useoutletcontext-testing

export const ComponentWithBpContext = ({
  context,
  children,
  url,
  urlWithPathParameterDefinition
}: ComponentWithBpContextProps) => {
  if (url) {
    return (
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/" element={<Outlet context={context as BpOutletContext} />}>
            <Route path={urlWithPathParameterDefinition} element={children} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  } else {
    return (
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Outlet context={context as BpOutletContext} />}>
            <Route index element={children} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  }
};


const fakeSetter = (matchId: string | undefined) => { };

export const EMPTY_CONTEXT = {
    setMessage: (message?: string) => console.log(message),
    competitionsToWatch: [],
    setSelectedMatchId: fakeSetter
};