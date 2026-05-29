import { PAGE_SIZES, PageParameter, PageResult } from 'types/page';
import { RequestFn, RequestOptions } from './types';
import { ResourceQuery } from './use-query';
import { useNotificationContext } from 'providers/notification';
import { useRequest } from 'ahooks';
import { buildRequestOptions } from './action/data';

const DEFAULT_QUERY: ResourceQuery<any> = {
  page: 1,
  size: Math.min(...PAGE_SIZES),
  filters: {}
};

export const useResourceList = <TFilters extends Record<string, any>, T>(
  api: RequestFn<
    TFilters &
      PageParameter & {
        sortField?: string;
        sortOrder?: string;
      },
    PageResult<T>
  >,
  query?: ResourceQuery<TFilters>,
  requestOptions?: RequestOptions<PageResult<T>, any>
) => {
  const finalQuery = query ?? (DEFAULT_QUERY as ResourceQuery<TFilters>);
  const { messageInstance } = useNotificationContext();

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
        refreshDeps: [finalQuery]
      },
      messageInstance
    })
  );

  const dataSource = request.data?.result ?? [];
  const total = request.data?.total ?? 0;

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
    } else {
      request.refresh();
    }
  };

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
    } else {
      request.refresh();
    }
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
