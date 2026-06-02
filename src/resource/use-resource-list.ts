import * as React from 'react';
import { useRequest } from 'ahooks';
import { PAGE_SIZES, PageParameter, PageResult } from 'types/page';
import { useNotificationContext } from 'providers/notification';
import { buildRequestOptions } from './action/data';
import { RequestFn, RequestOptions } from './types';
import { ResourceQuery } from './use-query';

const DEFAULT_QUERY = {
  page: 1,
  size: Math.min(...PAGE_SIZES),
  filters: {}
};

type ApiQuery<TFilters extends Record<string, unknown>> = TFilters &
  PageParameter & {
    sortField?: string;
    sortOrder?: string;
  };

export const useResourceList = <TFilters extends Record<string, unknown>, T>(
  api: RequestFn<ApiQuery<TFilters>, PageResult<T>>,
  query?: ResourceQuery<TFilters>,
  requestOptions?: RequestOptions<PageResult<T>, any>
) => {
  const { messageInstance } = useNotificationContext();
  const finalQuery = query ?? (DEFAULT_QUERY as ResourceQuery<TFilters>);

  /**
   * stable refresh deps
   */
  const queryKey = React.useMemo(() => JSON.stringify(finalQuery), [finalQuery]);

  const request = useRequest(
    async () => {
      return api({
        ...finalQuery.filters,
        page: finalQuery.page,
        size: finalQuery.size,
        sortField: finalQuery.sorter?.field,
        sortOrder: finalQuery.sorter?.order
      });
    },

    buildRequestOptions({
      options: {
        ...requestOptions,
        refreshDeps: [queryKey]
      },
      messageInstance
    })
  );

  const dataSource = request.data?.result ?? [];

  const total = request.data?.total ?? 0;

  /**
   * create success
   */
  const handleCreated = (
    setQuery?: (updater: (prev: ResourceQuery<TFilters>) => ResourceQuery<TFilters>) => void
  ) => {
    if (!query || !setQuery) {
      request.refresh();
      return;
    }

    const full = dataSource.length === finalQuery.size;

    if (full) {
      setQuery((prev) => ({
        ...prev,
        page: prev.page + 1
      }));

      return;
    }

    request.refresh();
  };

  /**
   * delete success
   */
  const handleDeleted = (
    setQuery?: (updater: (prev: ResourceQuery<TFilters>) => ResourceQuery<TFilters>) => void
  ) => {
    if (!query || !setQuery) {
      request.refresh();
      return;
    }

    const onlyOne = dataSource.length === 1;

    if (onlyOne && finalQuery.page > 1) {
      setQuery((prev) => ({
        ...prev,
        page: prev.page - 1
      }));
      return;
    }

    request.refresh();
  };

  return {
    ...request,
    query: finalQuery,
    dataSource,
    total,
    loading: request.loading,
    refresh: request.refresh,
    handleCreated,
    handleDeleted
  };
};
