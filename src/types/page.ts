import React from 'react';
import { useSearchParams } from 'react-router-dom';

export type PageResult<T> = {
  page: number;
  size: number;
  total: number;
  result: T;
};

export type PageParameter = { page: number; size: number };

export const useGo = (paged: PageParameter & { total: number }, action: 'prev' | 'next') => {
  const { total, page, size } = paged;
  const [index, setIndex] = React.useState(page);
  const pageCount = Math.ceil((total + (action === 'next' ? 1 : -1)) / size);
  const nextIndex = action === 'next' ? pageCount : pageCount < page ? pageCount : page;
  if (nextIndex !== page) {
    setIndex(nextIndex);
  }
  return index;
};

export const PAGE_SIZES = [10, 20, 30, 40, 50, 100];

export const useSearchPageInfo = (): PageParameter => {
  const [url] = useSearchParams();
  const page = Math.max(Number(url.get('page') ?? 1), 1);
  const size = Math.min(
    Number(url.get('size') ?? Math.min(...PAGE_SIZES)),
    Math.max(...PAGE_SIZES)
  );
  return { page, size };
};
