import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { buildQueryParams } from './buildQueryParams';

describe('buildQueryParams Utility', () => {
  it('should parse an empty query string correctly, returning default values', () => {
    const result = buildQueryParams('');
    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it('should parse query string with only page parameter', () => {
    const result = buildQueryParams('page=5');
    expect(result).toEqual({ page: 5, limit: 10 });
  });

  it('should parse query string with only limit parameter', () => {
    const result = buildQueryParams('limit=20');
    expect(result).toEqual({ page: 1, limit: 20 });
  });

  it('should parse query string with both page and limit parameters', () => {
    const result = buildQueryParams('page=3&limit=5');
    expect(result).toEqual({ page: 3, limit: 5 });
  });

  it('should handle non-numeric page/limit, defaulting to 1/10', () => {
    const result = buildQueryParams('page=abc&limit=xyz');
    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it('should parse query string with zero values', () => {
    const result = buildQueryParams('page=0&limit=0');
    expect(result).toEqual({ page: 0, limit: 0 });
  });

  it('should parse parameters correctly regardless of their order', () => {
    const result = buildQueryParams('limit=5&page=3');
    expect(result).toEqual({ page: 3, limit: 5 });
  });

  it('should ignore unknown or extra parameters', () => {
    const result = buildQueryParams('page=2&unknown=value&limit=10&extra=param');
    expect(result).toEqual({ page: 2, limit: 10 });
  });

  it('should ignore unknown or extra parameters and with sort', () => {
    const result = buildQueryParams('page=2&unknown=value&limit=10&extra=param&sort=views');
    expect(result).toEqual({ page: 2, limit: 10, sort: 'views' });
  });

  it('should handle missing values for parameters, defaulting to 1/10', () => {
    const result = buildQueryParams('page=&limit=');
    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it('should ignore unknown or extra parameters with author', () => {
    const result = buildQueryParams('page=2&unknown=value&limit=10&extra=param&author=john_doe');
    expect(result).toEqual({ page: 2, limit: 10, author: 'john_doe' });
  });

  it('should parse query string with sort, order, and author correctly', () => {
    const result = buildQueryParams('page=1&limit=5&sort=shares&order=asc&author=Alice');
    expect(result).toEqual({ page: 1, limit: 5, sort: 'shares', order: 'asc', author: 'Alice' });
  });

  it('should parse query string with sort only (no order), returning default order', () => {
    const result = buildQueryParams('page=1&limit=10&sort=views');
    expect(result).toEqual({ page: 1, limit: 10, sort: 'views' });
  });

  it('should handle empty author, sort, or order parameters correctly (returning undefined)', () => {
    const result = buildQueryParams('page=1&limit=10&author=&sort=&order=');
    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it('should prioritize direct parameters over potentially conflicting values (e.g., non-numeric order)', () => {
    const result = buildQueryParams('page=1&limit=10&sort=views&order=invalid');
    expect(result).toEqual({ page: 1, limit: 10, sort: 'views' });
  });

});