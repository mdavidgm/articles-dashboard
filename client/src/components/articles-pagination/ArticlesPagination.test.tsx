import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '../../store';
import ArticlesPagination from './ArticlesPagination';

vi.mock('../limit-selector/LimitSelector', () => ({
  default: ({ onChange, initialValue }: { onChange: (value: number) => void; initialValue: string }) => (
    <div>
      <label htmlFor="limit-select">Limit</label>
      <select
        id="limit-select"
        data-testid="limit-select"
        value={initialValue}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
  ),
}));

describe('ArticlesPagination Component', () => {
  const fetchArticlesSpy = vi.spyOn(useAppStore.getState(), 'fetchArticles');

  beforeEach(() => {
    vi.clearAllMocks();
    act(() => {
      if (useAppStore.getState().resetAllSlices) {
        useAppStore.getState().resetAllSlices();
      } else {
        useAppStore.setState({
          articlesIsLoading: false,
          totalCount: 0,
          currentPage: 1,
          articlesPerPage: 10,
          authorFilter: '',
          sortBy: '',
          sortOrder: 'desc',
          articlesData: [],
          articlesError: null,
        });
      }
    });
  });

  it('should call fetchArticles with default params on initial render', async () => {
    render(<ArticlesPagination />);
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
      expect(fetchArticlesSpy).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10, sort: '' })
      );
    });
  });

  it('should have "Order" select disabled when no "Sort By" is selected', () => {
    render(<ArticlesPagination />);
    const orderSelect = screen.getByRole('combobox', { name: /order/i });
    expect(orderSelect).toHaveAttribute('aria-disabled', 'true');
  });

  it('should call fetchArticles with new page on Pagination change', async () => {
    act(() => {
      useAppStore.setState({ totalCount: 25, currentPage: 1 });
    });
    render(<ArticlesPagination />);
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
    });
    const page2Button = screen.getByRole('button', { name: /go to page 2/i });
    fireEvent.click(page2Button);
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(2);
      expect(fetchArticlesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });
  });

  it('should reset to page 1 and call fetchArticles when limit changes', async () => {
    act(() => {
      useAppStore.setState({ totalCount: 50, currentPage: 3 });
    });
    render(<ArticlesPagination />);
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
    });
    const limitSelect = screen.getByTestId('limit-select');
    fireEvent.change(limitSelect, { target: { value: '5' } });
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(2);
      expect(fetchArticlesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, limit: 5 })
      );
    });
  });

  it('should call fetchArticles with new sort parameter when "Sort By" changes', async () => {
    render(<ArticlesPagination />);
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
    });
    const sortBySelect = screen.getByRole('combobox', { name: /sort by/i });
    fireEvent.mouseDown(sortBySelect);
    const viewsOption = await screen.findByRole('option', { name: /views/i });
    fireEvent.click(viewsOption);
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(2);
      expect(fetchArticlesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, sort: 'views' })
      );
    });
  });

  it('should call fetchArticles with new order parameter when "Order" changes', async () => {
    render(<ArticlesPagination />);
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
    });

    const sortBySelect = screen.getByRole('combobox', { name: /sort by/i });
    fireEvent.mouseDown(sortBySelect);
    const sharesOption = await screen.findByRole('option', { name: /shares/i });
    fireEvent.click(sharesOption);

    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(2);
      expect(fetchArticlesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ sort: 'shares' })
      );
    });

    const orderSelect = screen.getByRole('combobox', { name: /order/i });
    expect(orderSelect).not.toHaveAttribute('aria-disabled', 'true');
    fireEvent.mouseDown(orderSelect);
    const ascOption = await screen.findByRole('option', { name: /asc/i });
    fireEvent.click(ascOption);

    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(3);
      expect(fetchArticlesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ sort: 'shares', order: 'asc' })
      );
    });
  });

  it('should call fetchArticles and fetchHighlights when author filter is changed', async () => {
    // Preparamos espías para AMBAS acciones
    const fetchArticlesSpy = vi.spyOn(useAppStore.getState(), 'fetchArticles');
    const fetchHighlightsSpy = vi.spyOn(useAppStore.getState(), 'fetchHighlights');

    render(<ArticlesPagination />);

    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
    });

    const authorInput = screen.getByLabelText(/filter by author/i);
    fireEvent.change(authorInput, { target: { value: 'Tolkien' } });

    await waitFor(() => {
      // Verificamos que ambas acciones fueron llamadas
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(2);
      expect(fetchHighlightsSpy).toHaveBeenCalledTimes(1); // Esta es la nueva aserción

      // Verificamos los parámetros de fetchArticles
      expect(fetchArticlesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ author: 'Tolkien', page: 1 })
      );
    });
  });

  // En ArticlesPagination.test.tsx, dentro del describe principal

it('should handle API errors during fetch and update the store correctly', async () => {
  // 1. Simulamos una respuesta de error del servidor (status 500)
  const errorMessage = 'Internal Server Error';
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: false, // La clave para que se interprete como error
    status: 500,
    text: async () => errorMessage,
  } as Response);

  // 2. Renderizamos el componente, lo que dispara la llamada inicial a fetchArticles
  render(<ArticlesPagination />);

  // 3. Esperamos y verificamos que el estado en el store se haya actualizado correctamente
  await waitFor(() => {
    const state = useAppStore.getState();

    // Verificamos que se han ejecutado las líneas del bloque 'else'
    expect(state.articlesError).toBe(errorMessage);
    expect(state.articlesData).toBeNull();
    expect(state.articlesIsLoading).toBe(false);
    expect(state.currentPage).toBe(1);
  });
});
});