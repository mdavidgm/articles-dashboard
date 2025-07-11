import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LimitSelector from './LimitSelector';

describe('LimitSelector Component', () => {
  it('should set initial value correctly', () => {
    const handleChange = vi.fn();
    render(<LimitSelector onChange={handleChange} initialValue="5" />);
    const input = screen.getByLabelText('Limit') as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  it('should call onChange with the selected number', () => {
    const handleChange = vi.fn();
    render(<LimitSelector onChange={handleChange} initialValue="5" min={1} max={10} />);
    const input = screen.getByLabelText('Limit') as HTMLInputElement;

    fireEvent.mouseDown(input);
    
    const option7 = screen.getByRole('option', { name: '7' });
    fireEvent.click(option7);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(7);
  });

  it('should default to "10" and call onChange with 10 when trying to clear via UI', async () => {
    const handleChange = vi.fn();
    render(<LimitSelector onChange={handleChange} initialValue="5" />);
    const input = screen.getByLabelText('Limit') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(10); 
    });

    expect(input.value).toBe('10');
  });
});