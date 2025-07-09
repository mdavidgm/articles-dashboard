import { render, screen } from '@testing-library/react';
import App from './App'; // Asegúrate de que la ruta sea correcta

describe('App', () => {
  it('should render the headline', () => {
    render(<App />);

    const headline = screen.getByText(/Dashboard/i); // Busca texto que contenga "Vite + React"

    expect(headline).toBeInTheDocument();
  });
});