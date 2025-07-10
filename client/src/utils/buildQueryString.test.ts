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
});