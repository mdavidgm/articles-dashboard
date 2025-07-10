import { useEffect } from 'react';
import { useAppStore } from '../../store';

import { Pagination } from '@mui/material';
import type { QueryParams } from '../../store/types';

const ArticlesPagination = () => {

  const articlesIsLoading = useAppStore((state) => state.articlesIsLoading);
  const currentPage = useAppStore((state) => state.currentPage);
  const articlesPerPage = useAppStore((state) => state.articlesPerPage);
  const totalCount = useAppStore((state) => state.totalCount);

  const fetchArticles = useAppStore((state) => state.fetchArticles);

  const pageCount = Math.ceil(totalCount / articlesPerPage);

  // cite_start: Now pagination loads articles when the component mounts or user changes the page
  useEffect(() => {
    if (!articlesIsLoading) {
      const searchParams: QueryParams = {
        page: currentPage,
        limit: articlesPerPage,
      };
      fetchArticles(searchParams);
    }
  }, [fetchArticles, currentPage, articlesPerPage, articlesIsLoading]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    if (value !== currentPage) {
      const searchParams: QueryParams = {
        page: value,
        limit: articlesPerPage,
      };
      fetchArticles(searchParams);
    }
  };

  return (
    <Pagination
      count={pageCount}
      page={currentPage}
      onChange={handlePageChange}
      color="primary"
      showFirstButton
      showLastButton
      disabled={articlesIsLoading}
    />
  );
};

export default ArticlesPagination;