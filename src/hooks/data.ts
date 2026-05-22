import { useRequest } from 'ahooks';
import { MessageInstance } from 'antd/es/message/interface';
import { useNotificationContext } from 'providers/notification';
import React from 'react';
import intl from 'react-intl-universal';
import { useSearchParams } from 'react-router-dom';
import { PageParameter, PageResult, transform, useSearchPageInfo } from 'types/page';

export type RequestFn<P, R> = (params: P) => Promise<R>;
type RequestOptions<TData, TParams> = {
  manual?: boolean;
  defaultParams?: TParams;
  ready?: boolean;
  refreshDeps?: any[];
  cacheKey?: string;
  staleTime?: number;
  onSuccess?: (params: { data: TData; params: TParams; messageInstance?: MessageInstance }) => void;
  onError?: (e: any) => void;
};

export const useList = <P, T>(
  getList: RequestFn<P, T[]>,
  options?: {
    manual?: boolean;
    defaultParams?: P;
  } & RequestOptions<T[], P>
) => {
  const { messageInstance } = useNotificationContext();
  const request = useRequest(getList, buildRequestOptions({ options, messageInstance }));

  return {
    ...request,
    list: request.data || [],
    total: request.data?.length || 0
  };
};

export const usePaginationList = <P extends Record<string, any>, T>(
  api: RequestFn<P & PageParameter, PageResult<T>>,
  options?: {
    defaultPageSize?: number;
    syncUrl?: boolean;
  } & RequestOptions<PageResult<T>, P>
) => {
  const paged = useSearchPageInfo(options?.syncUrl ?? true);
  const [page, setPage] = React.useState(paged.page);
  const [pageSize, setPageSize] = React.useState(options?.defaultPageSize || paged.size);
  const [params, setParams] = React.useState<P | undefined>(options?.defaultParams);
  const [, setUrlState] = useSearchParams();
  const { messageInstance } = useNotificationContext();
  const request = useRequest(async (extra?: P) => {
    const mergedParams = {
      ...(params || {}),
      ...(extra || {})
    };

    return await api({
      ...mergedParams,
      page,
      size: pageSize
    } as P & PageParameter);
  }, buildRequestOptions({ options: { ...options, refreshDeps: [page, pageSize, params] }, messageInstance }));

  const search = (action: 'prev' | 'next', p?: P) => {
    if (request.data) {
      const { page, size, total } = request.data;
      const next = getNext({ page, size, total }, action);
      if (next !== page) {
        setPage(next);
        setParams(p);
        setUrlState({ page: `${next}`, size: `${size}` });
      } else {
        request.refresh();
      }
    }
  };

  return {
    ...request,
    pagination: {
      ...transform(request.data).pagination,
      onChange: (page: number, size: number) => {
        setPage(page);
        setPageSize(size);
        setUrlState({ page: `${page}`, size: `${size}` });
      }
    },
    search
  };
};

const getNext = (paged: PageParameter & { total: number }, action: 'prev' | 'next') => {
  const { total, page, size } = paged;
  let index = page;
  const pageCount = Math.ceil((total + (action === 'next' ? 1 : -1)) / size);
  const nextIndex = action === 'next' ? pageCount : pageCount < page ? pageCount : page;
  if (nextIndex !== page) {
    index = nextIndex;
  }
  return index;
};

export const useCreate = <P, T>(create: RequestFn<P, T>, options?: RequestOptions<T, P>) => {
  const { messageInstance } = useNotificationContext();
  return useRequest(
    create,
    buildRequestOptions({
      options: { ...options, manual: true },
      messageInstance,
      successMessage: 'CREATED_SUCCESSFUL'
    })
  );
};

export const useUpdate = <P, T>(update: RequestFn<P, T>, options?: RequestOptions<T, P>) => {
  const { messageInstance } = useNotificationContext();
  return useRequest(
    update,
    buildRequestOptions({
      options: { ...options, manual: true },
      messageInstance,
      successMessage: 'UPDATED_SUCCESSFUL'
    })
  );
};

export const useDelete = <P, T>(deleteFn: RequestFn<P, T>, options?: RequestOptions<T, P>) => {
  const { messageInstance } = useNotificationContext();
  return useRequest(
    deleteFn,
    buildRequestOptions({
      options: { ...options, manual: true },
      messageInstance,
      successMessage: 'DELETED_SUCCESSFUL'
    })
  );
};

export const useDataFetch = <P, T>(fetchFn: RequestFn<P, T>, options?: RequestOptions<T, P>) => {
  const { messageInstance } = useNotificationContext();
  return useRequest(fetchFn, buildRequestOptions({ options, messageInstance }));
};

const buildRequestOptions = <P, T>({
  options,
  messageInstance,
  successMessage
}: {
  options: any;
  messageInstance: MessageInstance;
  successMessage?: string;
}) => ({
  manual: options?.manual ?? false,
  defaultParams: options?.defaultParams ? [options.defaultParams] : (undefined as any),
  cacheKey: options?.cacheKey,
  staleTime: options?.staleTime,
  ready: options?.ready ?? true,
  refreshDeps: options?.refreshDeps,
  onSuccess: (data: T, param: any[]) => {
    if (successMessage) {
      messageInstance.success(intl.get(successMessage));
    } else {
      options?.onSuccess?.({ data, params: param?.[0] as P, messageInstance });
    }
  },
  onError: (e: Error) => handleError(e, messageInstance, options?.onError)
});

const handleError = (e: Error, messageInstance: MessageInstance, onError?: (e: any) => void) => {
  if (onError) {
    onError(e);
  } else {
    messageInstance.error(intl.get(e.message ?? 'request.failure'));
  }
};

type MaybePromise<T> = T | Promise<T>;

export const createSubmitHandler = <TValues>(
  onSubmit?: (values: TValues) => MaybePromise<void>,
  onSuccess?: () => void
) => {
  return async (values: TValues) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
        onSuccess?.();
      }
    } catch (error) {}
  };
};
