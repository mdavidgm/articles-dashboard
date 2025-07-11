import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { buildQueryString } from './buildQueryString';
import type { QueryParams } from '../store/types';

describe('buildQueryString Utility', () => {
  it('should return an empty string for empty params', () => {
    const params: QueryParams = {};
    expect(buildQueryString(params)).toBe('');
  });

  it('should correctly build query with only page', () => {
    const params: QueryParams = { page: 1 };
    expect(buildQueryString(params)).toBe('page=1');
  });

  it('should correctly build query with only limit', () => {
    const params: QueryParams = { limit: 10 };
    expect(buildQueryString(params)).toBe('limit=10');
  });

  it('should correctly build query with page and limit', () => {
    const params: QueryParams = { page: 2, limit: 5 };
    expect(buildQueryString(params)).toBe('page=2&limit=5');
  });

  it('should correctly build query with page and limit and author', () => {
    const params: QueryParams = { page: 2, limit: 5, author: 'john_doe' };
    expect(buildQueryString(params)).toBe('page=2&limit=5&author=john_doe');
  });
  it('should correctly build query with page and limit and author and sort', () => {
    const params: QueryParams = { page: 2, limit: 5, author: 'john_doe', sort: 'shares' };
    expect(buildQueryString(params)).toBe('page=2&limit=5&author=john_doe&sort=shares');
  });
  it('should correctly build query with page and limit and author empty', () => {
    const params: QueryParams = { page: 2, limit: 5, author: '' };
    expect(buildQueryString(params)).toBe('page=2&limit=5');
  });

  it('should correctly build query with sort and order', () => {
    const params: QueryParams = { sort: 'views', order: 'desc' };
    expect(buildQueryString(params)).toBe('sort=views&order=desc');
  });

  it('should correctly build query with all parameters including sort and order', () => {
    const params: QueryParams = { page: 1, limit: 10, author: 'Jane', sort: 'views', order: 'asc' };
    expect(buildQueryString(params)).toBe('page=1&limit=10&author=Jane&sort=views&order=asc');
  });

  it('should not include sort or order if they are null or undefined', () => {
    const params: QueryParams = { page: 1, sort: undefined, order: undefined };
    expect(buildQueryString(params)).toBe('page=1');
  });

  it('should handle sort without order (order defaults to undefined in QueryParams)', () => {
    const params: QueryParams = { page: 1, sort: 'shares' };
    expect(buildQueryString(params)).toBe('page=1&sort=shares');
  });
});