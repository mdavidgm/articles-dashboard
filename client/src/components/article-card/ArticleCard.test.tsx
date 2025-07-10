import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import type { ArticleCard as ArticleCardProps } from '../../store/types';
import ArticleCard from './ArticleCard';

describe('ArticleCard Component', () => {
  const baseMockArticle: ArticleCardProps = {
    id: 1,
    title: 'An Accessible Guide to Testing',
    author: 'Jane Doe',
    content: 'This is the main content of the article.',
    views: 150,
    shares: 25,
    createdAt: 1752205200000,
    summary: undefined,
  };

  it('should render the main article content correctly', () => {
    render(<ArticleCard {...baseMockArticle} />);

    const article = screen.getByRole('article', {
      name: /An Accessible Guide to Testing/i,
    });

    expect(article).toBeInTheDocument();

    const heading = within(article).getByRole('heading', {
      name: /An Accessible Guide to Testing/i,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    expect(within(article).getByText(/By: Jane Doe/i)).toBeInTheDocument();
    expect(within(article).getByText(/main content of the article/i)).toBeInTheDocument();
  });

  it('should display the article stats correctly', () => {
    render(<ArticleCard {...baseMockArticle} />);

    expect(screen.getByLabelText(/Views: 150/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shares: 25/i)).toBeInTheDocument();

    const timeElement = screen.getByRole('time');
    const expectedDateString = new Date(baseMockArticle.createdAt).toLocaleDateString();
    expect(timeElement).toHaveTextContent(expectedDateString);
    expect(timeElement).toHaveAttribute('datetime', expectedDateString);
  });

  describe('when a summary is provided', () => {
    it('should render the summary section', () => {
      const withSummary = { ...baseMockArticle, summary: 'This is a test summary.' };
      render(<ArticleCard {...withSummary} />);

      const summaryHeading = screen.getByRole('heading', { name: /Summary/i, level: 3 });
      expect(summaryHeading).toBeInTheDocument();
      expect(screen.getByText(/This is a test summary/i)).toBeInTheDocument();
    });
  });

  describe('when a summary is not provided', () => {
    it('should not render the summary section', () => {
      render(<ArticleCard {...baseMockArticle} />);

      const summaryHeading = screen.queryByRole('heading', { name: /Summary/i });
      expect(summaryHeading).not.toBeInTheDocument();
    });
  });
});