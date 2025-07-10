import { render, screen, within, fireEvent } from '@testing-library/react';
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

  const longMockArticle: ArticleCardProps = {
    ...baseMockArticle,
    content:
      'This is a very long piece of content that should definitely exceed one line and trigger the "View More" button. It needs to be long enough to demonstrate the collapsing functionality effectively. The character limit for showing the button is 150 characters, so this text easily surpasses that threshold to ensure the button is always present for testing the expand/collapse behavior. This helps verify that the content is initially truncated and expands fully upon interaction.',
  };

  const shortMockArticle: ArticleCardProps = {
    ...baseMockArticle,
    content: 'This is short content.',
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

  describe('Content collapsing functionality', () => {
    it('should show "View More" and collapse content initially if long', () => {
      render(<ArticleCard {...longMockArticle} />);

      const viewMoreButton = screen.getByRole('button', { name: /View More/i });
      expect(viewMoreButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /View Less/i })).not.toBeInTheDocument();

    });

    it('should expand content and show "View Less" on "View More" click', () => {
      render(<ArticleCard {...longMockArticle} />);

      const viewMoreButton = screen.getByRole('button', { name: /View More/i });
      fireEvent.click(viewMoreButton);

      const viewLessButton = screen.getByRole('button', { name: /View Less/i });
      expect(viewLessButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /View More/i })).not.toBeInTheDocument();

    });

    it('should collapse content and show "View More" on "View Less" click', () => {
      render(<ArticleCard {...longMockArticle} />);

      const viewMoreButton = screen.getByRole('button', { name: /View More/i });
      fireEvent.click(viewMoreButton);

      const viewLessButton = screen.getByRole('button', { name: /View Less/i });
      fireEvent.click(viewLessButton);

      expect(viewMoreButton).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /View Less/i })).not.toBeInTheDocument();
    });

    it('should not show "View More" button if content is short', () => {
      render(<ArticleCard {...shortMockArticle} />);

      expect(screen.queryByRole('button', { name: /View More/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /View Less/i })).not.toBeInTheDocument();
      
      expect(screen.getByText(shortMockArticle.content)).toBeInTheDocument();
    });
  });
});