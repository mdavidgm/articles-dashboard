import type { QueryParams } from '../store/types';

export const buildQueryString = (searchParams: QueryParams): string => {
  const urlSearchParams = new URLSearchParams();
  if (searchParams.page !== undefined) {
    urlSearchParams.set('page', searchParams.page.toString());
  }
  if (searchParams.limit !== undefined) {
    urlSearchParams.set('limit', searchParams.limit.toString());
  }

  return urlSearchParams.toString();
};