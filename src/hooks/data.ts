import { useRequest } from 'ahooks';
import { MessageInstance } from 'antd/es/message/interface';
import { useNotificationContext } from 'providers/notification';
import React from 'react';
import intl from 'react-intl-universal';
import { useSearchParams } from 'react-router-dom';
import { ActionState } from 'types/common';
import { PageParameter, PageResult, transform, useSearchPageInfo } from 'types/page';

type RequestFn<P, R> = (params: P) => Promise<R>;

export const useList = <P, T>(
  getList: RequestFn<P, T[]>,
  options?: {
    manual?: boolean;
    defaultParams?: P;
    onError?: (e: any) => void;
  }
) => {
  const request = useRequest(getList, {
    manual: options?.manual ?? false,
    defaultParams: options?.defaultParams ? [options.defaultParams] : undefined,
    onError: options?.onError
  });

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
    manual?: boolean;
    defaultParams?: P;
    syncUrl?: boolean;
  }
) => {
  const paged = useSearchPageInfo(options?.syncUrl ?? true);
  const [page, setPage] = React.useState(paged.page);
  const [pageSize, setPageSize] = React.useState(options?.defaultPageSize || paged.size);
  const [params, setParams] = React.useState<P | undefined>(options?.defaultParams);
  const [, setUrlState] = useSearchParams();

  const request = useRequest(
    async (extra?: P) => {
      const mergedParams = {
        ...(params || {}),
        ...(extra || {})
      };

      return await api({
        ...mergedParams,
        page,
        size: pageSize
      } as P & PageParameter);
    },
    {
      manual: options?.manual ?? false,
      refreshDeps: [page, pageSize, params]
    }
  );

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

export const useCreate = <P, T>(
  create: RequestFn<P, T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (e: any) => void;
  }
) => {
  const { messageInstance } = useNotificationContext();
  return useRequest(create, {
    manual: true,
    onSuccess: (data) => {
      messageInstance.success(intl.get('CREATED_SUCCESSFUL'));
      options?.onSuccess?.(data);
    },
    onError: (e) => handleError(e, messageInstance, options?.onError)
  });
};

export const useUpdate = <P, T>(
  update: RequestFn<P, T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (e: any) => void;
  }
) => {
  const { messageInstance } = useNotificationContext();
  return useRequest(update, {
    manual: true,
    onSuccess: (data) => {
      messageInstance.success(intl.get('UPDATED_SUCCESSFUL'));
      options?.onSuccess?.(data);
    },
    onError: (e) => handleError(e, messageInstance, options?.onError)
  });
};

export const useDelete = <P>(
  deleteFn: (params: P) => Promise<any>,
  options?: {
    onSuccess?: () => void;
    onError?: (e: any) => void;
  }
) => {
  const { messageInstance } = useNotificationContext();
  return useRequest(deleteFn, {
    manual: true,
    onSuccess: () => {
      messageInstance.success(intl.get('DELETED_SUCCESSFUL'));
      options?.onSuccess?.();
    },
    onError: (e) => handleError(e, messageInstance, options?.onError)
  });
};

const handleError = (e: Error, messageInstance: MessageInstance, onError?: (e: any) => void) => {
  if (onError) {
    onError(e);
  } else {
    messageInstance.error(e.message ?? 'request.failure');
  }
};

export function createActionState<T>(req: {
  loading: boolean;
  runAsync: (...params: any) => Promise<any>;
}): ActionState<T>;

export function createActionState(req: {
  loading: boolean;
  runAsync: () => Promise<any>;
}): ActionState<void>;

export function createActionState(req: {
  loading: boolean;
  runAsync: (...args: any[]) => Promise<any>;
}): ActionState<any> {
  return {
    loading: req.loading,
    submit: (async (params?: any) => {
      // 无参数
      if (params === undefined) {
        await req.runAsync();
      } else {
        // 单参数（推荐标准用法）
        await req.runAsync(params);
      }
    }) as any
  };
}
