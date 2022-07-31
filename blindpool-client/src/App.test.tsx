import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('See if anything renders at all', () => {
  render(<App />);
  const linkElement = screen.getByText(/What is a blind pool/i);
  expect(linkElement).toBeInTheDocument();
});
