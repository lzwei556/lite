import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { PAGE_SIZES, PageParameter } from 'types/page';

export type ResourceSorter = {
  field?: string;
  order?: 'ascend' | 'descend';
};

export type ResourceQuery<TFilters extends Record<string, unknown> = Record<string, unknown>> =
  PageParameter & {
    sorter?: ResourceSorter;
    filters: TFilters;
  };

export type ResourceQueryController<TFilters extends Record<string, unknown>> = {
  query: ResourceQuery<TFilters>;
  setQuery: (
    updater:
      | Partial<ResourceQuery<TFilters>>
      | ((prev: ResourceQuery<TFilters>) => Partial<ResourceQuery<TFilters>>)
  ) => void;
  patchFilters: (patch: Partial<TFilters>) => void;
  replaceFilters: (filters: TFilters) => void;
  resetFilters: () => void;
  setPagination: (page: number, size: number) => void;
  setSorter: (sorter?: ResourceSorter) => void;
  reset: () => void;
};

type UseResourceQueryOptions<TFilters extends Record<string, unknown>> = {
  schema?: z.ZodType<TFilters>;
  defaultFilters?: Partial<TFilters>;
  defaultPage?: number;
  defaultSize?: number;
  syncUrl?: boolean;
};

type QueryUpdater<TFilters extends Record<string, unknown>> =
  | Partial<ResourceQuery<TFilters>>
  | ((prev: ResourceQuery<TFilters>) => Partial<ResourceQuery<TFilters>>);

const RESERVED_KEYS = new Set(['page', 'size', 'sortField', 'sortOrder']);

/**
 * overloads
 */
export function useResourceQuery(): ResourceQueryController<Record<string, unknown>>;

export function useResourceQuery<TFilters extends Record<string, unknown>>(
  options: UseResourceQueryOptions<TFilters>
): ResourceQueryController<TFilters>;

export function useResourceQuery<
  TFilters extends Record<string, unknown> = Record<string, unknown>
>(options?: UseResourceQueryOptions<TFilters>): ResourceQueryController<TFilters> {
  const {
    schema,
    defaultFilters,
    defaultPage = 1,
    defaultSize = Math.min(...PAGE_SIZES),
    syncUrl = true
  } = options ?? {};

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultQuery = React.useMemo<ResourceQuery<TFilters>>(
    () => ({
      page: defaultPage,
      size: defaultSize,
      filters: (defaultFilters ?? {}) as TFilters
    }),
    [defaultFilters, defaultPage, defaultSize]
  );

  /**
   * local mode
   */
  const [localQuery, setLocalQuery] = React.useState(defaultQuery);

  /**
   * url mode
   */
  const urlQuery = React.useMemo<ResourceQuery<TFilters>>(() => {
    const rawFilters: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (RESERVED_KEYS.has(key)) {
        return;
      }

      rawFilters[key] = value;
    });

    let parsedFilters: Partial<TFilters> = {};

    if (schema) {
      const result = schema.safeParse(rawFilters);

      if (result.success) {
        parsedFilters = result.data;
      }
    } else {
      parsedFilters = rawFilters as Partial<TFilters>;
    }

    const page = parsePositiveInt(searchParams.get('page'), defaultPage, 1);
    const size = parsePositiveInt(searchParams.get('size'), defaultSize, 1);
    const sortField = searchParams.get('sortField') ?? undefined;
    const sortOrder = searchParams.get('sortOrder') as 'ascend' | 'descend' | null;

    return {
      page,
      size,
      filters: {
        ...(defaultFilters ?? {}),
        ...parsedFilters
      } as TFilters,
      sorter: sortField
        ? {
            field: sortField,
            order: sortOrder ?? undefined
          }
        : undefined
    };
  }, [searchParams, schema, defaultFilters, defaultPage, defaultSize]);

  const query = syncUrl ? urlQuery : localQuery;

  const updateQuery = React.useCallback(
    (updater: QueryUpdater<TFilters>) => {
      const patch = typeof updater === 'function' ? updater(query) : updater;

      const nextQuery = {
        ...query,
        ...patch
      };

      if (!syncUrl) {
        setLocalQuery(nextQuery);
        return;
      }

      const next = new URLSearchParams();
      next.set('page', String(nextQuery.page));
      next.set('size', String(nextQuery.size));

      if (nextQuery.sorter?.field) {
        next.set('sortField', nextQuery.sorter.field);
      }

      if (nextQuery.sorter?.order) {
        next.set('sortOrder', nextQuery.sorter.order);
      }

      Object.entries(nextQuery.filters).forEach(([key, value]) => {
        if (value == null) {
          return;
        }
        if (value === '') {
          return;
        }
        if (Array.isArray(value) && value.length === 0) {
          return;
        }
        next.set(key, serialize(value));
      });

      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next, {
          replace: true
        });
      }
    },
    [query, syncUrl, searchParams, setSearchParams]
  );

  const patchFilters = React.useCallback(
    (patch: Partial<TFilters>) => {
      updateQuery((prev) => ({
        page: 1,
        filters: {
          ...prev.filters,
          ...patch
        }
      }));
    },
    [updateQuery]
  );

  const replaceFilters = React.useCallback(
    (filters: TFilters) => {
      updateQuery({
        page: 1,
        filters
      });
    },
    [updateQuery]
  );

  const resetFilters = React.useCallback(() => {
    updateQuery({
      page: 1,
      filters: (defaultFilters ?? {}) as TFilters
    });
  }, [defaultFilters, updateQuery]);

  const setPagination = React.useCallback(
    (page: number, size: number) => {
      updateQuery({
        page,
        size
      });
    },
    [updateQuery]
  );

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
    if (!syncUrl) {
      setLocalQuery(defaultQuery);
      return;
    }

    setSearchParams(new URLSearchParams(), {
      replace: true
    });
  }, [defaultQuery, setSearchParams, syncUrl]);

  return {
    query,
    setQuery: updateQuery,
    patchFilters,
    replaceFilters,
    resetFilters,
    setPagination,
    setSorter,
    reset
  };
}

function parsePositiveInt(value: string | null, fallback: number, min: number) {
  const parsed = Number.parseInt(value ?? '');

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.max(parsed, min);
}

function serialize(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(',');
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}
