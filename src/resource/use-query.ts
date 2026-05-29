import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZES, PageParameter } from 'types/page';

export type ResourceSorter = {
  field?: string;
  order?: 'ascend' | 'descend';
};

export type ResourceQuery<TFilters extends Record<string, any> = Record<string, any>> =
  PageParameter & {
    filters: TFilters;
    sorter?: ResourceSorter;
  };

type UseResourceQueryOptions<TFilters extends Record<string, any>> = {
  defaultQuery?: Partial<ResourceQuery<TFilters>>;
  syncUrl?: boolean;
};

const DEFAULT_QUERY: ResourceQuery<any> = {
  page: 1,
  size: Math.min(...PAGE_SIZES),
  filters: {}
};

export const useResourceQuery = <TFilters extends Record<string, any>>(
  options?: UseResourceQueryOptions<TFilters>
) => {
  const syncUrl = options?.syncUrl ?? true;

  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * merged default query
   */
  const defaultQuery = React.useMemo<ResourceQuery<TFilters>>(
    () => ({
      ...DEFAULT_QUERY,
      ...(options?.defaultQuery || {})
    }),
    [options?.defaultQuery]
  );

  /**
   * url -> query
   *
   * source of truth
   */
  const query = React.useMemo<ResourceQuery<TFilters>>(() => {
    if (!syncUrl) {
      return defaultQuery;
    }

    const page = parsePositiveInt(searchParams.get('page'), defaultQuery.page, 1);

    const size = Math.min(
      parsePositiveInt(searchParams.get('size'), defaultQuery.size, DEFAULT_QUERY.size),
      Math.max(...PAGE_SIZES)
    );

    const sortField = searchParams.get('sortField') ?? undefined;

    const sortOrder = searchParams.get('sortOrder') as 'ascend' | 'descend' | null;

    const filtersStr = searchParams.get('filters');

    let filters = defaultQuery.filters;

    if (filtersStr) {
      try {
        filters = JSON.parse(filtersStr);
      } catch {
        filters = defaultQuery.filters;
      }
    }

    return {
      page,
      size,
      filters,
      sorter: sortField
        ? {
            field: sortField,
            order: sortOrder ?? undefined
          }
        : undefined
    };
  }, [defaultQuery, searchParams, syncUrl]);

  /**
   * query -> url
   */
  const updateQuery = React.useCallback(
    (
      updater:
        | Partial<ResourceQuery<TFilters>>
        | ((prev: ResourceQuery<TFilters>) => ResourceQuery<TFilters>)
    ) => {
      const nextQuery =
        typeof updater === 'function'
          ? updater(query)
          : {
              ...query,
              ...updater
            };

      if (!syncUrl) {
        return;
      }

      const next = new URLSearchParams();

      /**
       * pagination
       */
      next.set('page', `${nextQuery.page}`);

      next.set('size', `${nextQuery.size}`);

      /**
       * sorter
       */
      if (nextQuery.sorter?.field) {
        next.set('sortField', nextQuery.sorter.field);
      }

      if (nextQuery.sorter?.order) {
        next.set('sortOrder', nextQuery.sorter.order);
      }

      /**
       * filters
       */
      if (Object.keys(nextQuery.filters).length > 0) {
        next.set('filters', JSON.stringify(nextQuery.filters));
      }

      /**
       * avoid useless navigation
       */
      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next, {
          replace: true
        });
      }
    },
    [query, searchParams, setSearchParams, syncUrl]
  );

  const setPagination = React.useCallback(
    (page: number, size: number) => {
      updateQuery({
        page,
        size
      });
    },
    [updateQuery]
  );

  const setFilters = React.useCallback(
    (filters: Partial<TFilters>) => {
      updateQuery((prev) => ({
        ...prev,
        page: 1,
        filters: {
          ...prev.filters,
          ...filters
        }
      }));
    },
    [updateQuery]
  );

  const resetFilters = React.useCallback(() => {
    updateQuery((prev) => ({
      ...prev,
      page: 1,
      filters: defaultQuery.filters
    }));
  }, [defaultQuery.filters, updateQuery]);

  const setSorter = React.useCallback(
    (sorter?: ResourceSorter) => {
      updateQuery({
        page: 1,
        sorter
      });
    },
    [updateQuery]
  );

  const reset = React.useCallback(() => {
    updateQuery(defaultQuery);
  }, [defaultQuery, updateQuery]);

  return {
    query,
    setQuery: updateQuery,
    setPagination,
    setFilters,
    resetFilters,
    setSorter,
    reset
  };
};

const parsePositiveInt = (value: string | null, fallback: number, min: number) => {
  const parsed = Number.parseInt(value || '');

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.max(parsed, min);
};
