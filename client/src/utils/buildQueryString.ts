import type { QueryParams } from '../store/types';

export const buildQueryString = (searchParams: QueryParams): string => {
  const urlSearchParams = new URLSearchParams();
  if (searchParams.page !== undefined) {
    urlSearchParams.set('page', searchParams.page.toString());
  }
  if (searchParams.limit !== undefined) {
    urlSearchParams.set('limit', searchParams.limit.toString());
  }
  if (searchParams.author) {
    urlSearchParams.set('author', searchParams.author);
  }
  if (searchParams.sort) {
    urlSearchParams.set('sort', searchParams.sort);
  }
  if (searchParams.order) {
    urlSearchParams.set('order', searchParams.order);
  }
  
  return urlSearchParams.toString();
};