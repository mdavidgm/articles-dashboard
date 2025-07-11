import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../store';

import { FormControl, InputLabel, MenuItem, Pagination, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { QueryParams } from '../../store/types';
import { buildQueryParams } from '../../utils/buildQueryParams';

import LimitSelector from '../limit-selector/LimitSelector';
import {
  Box,
  TextField,
} from '@mui/material';

const ArticlesPagination = () => {

  const articlesIsLoading = useAppStore((state) => state.articlesIsLoading);
  const currentPage = useAppStore((state) => state.currentPage);
  const articlesPerPage = useAppStore((state) => state.articlesPerPage);
  const totalCount = useAppStore((state) => state.totalCount);
  const pageCount = Math.ceil(totalCount / articlesPerPage);
  const authorFilter = useAppStore((state) => state.authorFilter);
  const sortBy = useAppStore((state) => state.sortBy);
  const sortOrder = useAppStore((state) => state.sortOrder);
  const fetchArticles = useAppStore((state) => state.fetchArticles);
  const setAuthorFilter = useAppStore((state) => state.setAuthorFilter);
  const setSortBy = useAppStore((state) => state.setSortBy);
  const setSortOrder = useAppStore((state) => state.setSortOrder);

  // cite_start: Boolean to avoid infinite loop on initial load from URL
  const initialLoadFromURL = useRef(false);

  // cite_start: If there are parameters in the URL, fetch articles with those parameters
  useEffect(() => {
    const handleUrlLoadAndPopstate = () => {
      if (window.location.search) {
        initialLoadFromURL.current = true;
        const queryParams = buildQueryParams(window.location.search);
        fetchArticles(queryParams);
      }
    };
    window.addEventListener('popstate', handleUrlLoadAndPopstate);
    handleUrlLoadAndPopstate();

    return () => {
      window.removeEventListener('popstate', handleUrlLoadAndPopstate);
    };
  }, [fetchArticles]);

  // cite_start: If there are not parameters in the URL, fetch articles with default parameters
  useEffect(() => {
    if (initialLoadFromURL.current) {
      initialLoadFromURL.current = false;
      return;
    }

    if (!articlesIsLoading) {
      const searchParams: QueryParams = {
        page: currentPage,
        limit: articlesPerPage,
        author: authorFilter,
        sort: sortBy,
        order: sortOrder,
      };
      fetchArticles(searchParams);
    }
  }, [fetchArticles, articlesIsLoading]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    if (value !== currentPage) {
      const searchParams: QueryParams = {
        page: value,
        limit: articlesPerPage,
        author: authorFilter,
        sort: sortBy,
        order: sortOrder,
      };
      fetchArticles(searchParams);
    }
  }, [currentPage, authorFilter, articlesPerPage, fetchArticles, sortBy]);

  const handleLimitChange = useCallback((value: number | null) => {
    if (value !== null && value !== articlesPerPage) {
      const searchParams: QueryParams = {
        page: currentPage,
        limit: value,
        author: authorFilter,
        sort: sortBy,
        order: sortOrder,
      };
      fetchArticles(searchParams);
    }
  }, [articlesPerPage, authorFilter, currentPage, sortBy, fetchArticles]);

  const handleAuthorFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorFilter(event.target.value);
  }, [setAuthorFilter, fetchArticles]);

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        p: 1,
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Filter by Author"
          variant="outlined"
          value={authorFilter || ''}
          onChange={handleAuthorFilterChange}
          sx={{ minWidth: 300, flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by-select"
            value={sortBy || ''}
            label="Sort By"
            onChange={handleSortByChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="views">Views</MenuItem>
            <MenuItem value="shares">Shares</MenuItem>
          </Select>
        </FormControl>
  
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="sort-order-label">Order</InputLabel>
          <Select
            labelId="sort-order-label"
            id="sort-order-select"
            value={sortOrder}
            label="Order"
            onChange={handleSortOrderChange}
            disabled={!sortBy}
          >
            <MenuItem value="asc">Asc</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
          </Select>
        </FormControl>
      </Box>
  
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          disabled={articlesIsLoading}
        />
        <LimitSelector
          onChange={handleLimitChange}
          initialValue={articlesPerPage.toString()}
        />
      </Box>
    </Box>
  );
};

export default ArticlesPagination;