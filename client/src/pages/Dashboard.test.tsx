import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import App from '../App';


describe('App', () => {
  it('should render the headline', () => {
    render(<App />);

    const headline = screen.getByText(/Dashboard/i);

    expect(headline).toBeInTheDocument();
  });
});