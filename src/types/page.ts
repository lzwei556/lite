import { TablePaginationConfig } from 'antd';
import { useSearchParams } from 'react-router-dom';

export type PageResult<T> = {
  page: number;
  size: number;
  total: number;
  result: T[];
};

export const transform = <T>(
  pageResult?: PageResult<T>
): {
  pagination: TablePaginationConfig;
  list: T[];
} => {
  if (!pageResult) {
    return { pagination: {}, list: [] as T[] };
  }
  const { page, size, total, result } = pageResult;
  return { pagination: { current: page, pageSize: size, total }, list: result };
};

export type PageParameter = { page: number; size: number };

export const PAGE_SIZES = [10, 20, 30, 40, 50, 100];

export const useSearchPageInfo = (enabled: boolean): PageParameter => {
  const [url] = useSearchParams();
  let page = 1,
    size = Math.min(...PAGE_SIZES);
  if (enabled) {
    page = Math.max(Number.parseInt(url.get('page') || '1'), 1);
    size = Math.min(
      Number.parseInt(url.get('size') || `${Math.min(...PAGE_SIZES)}`),
      Math.max(...PAGE_SIZES)
    );
  }

  return { page, size };
};
