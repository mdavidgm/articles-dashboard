import type { QueryParams } from '../store/types';

export const buildQueryParams = (queryString: string): QueryParams => {
  const params = new URLSearchParams(queryString);
  const parsedPage = parseInt(params.get('page') || '1', 10);
  const page = isNaN(parsedPage) ? 1 : parsedPage;

  const parsedLimit = parseInt(params.get('limit') || '10', 10);
  const limit = isNaN(parsedLimit) ? 10 : parsedLimit;

  const author = params.get('author') || '';

  const sort = params.get('sort');
  const order = params.get('order');

  const urlQueryParams: QueryParams = {
    page: page,
    limit: limit,
  };

  if (author) {
    urlQueryParams.author = author;
  }

  const allowedSortValues = ['views', 'shares'];
  if (sort && allowedSortValues.includes(sort)) {
    urlQueryParams.sort = sort;
  }

  const allowedOrderValues = ['asc', 'desc'];
  if (order && allowedOrderValues.includes(order)) {
    urlQueryParams.order = order;
  }
  
  return urlQueryParams;
};