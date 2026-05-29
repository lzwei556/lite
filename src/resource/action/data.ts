import { useRequest } from 'ahooks';
import { MessageInstance } from 'antd/es/message/interface';
import { useNotificationContext } from 'providers/notification';
import intl from 'react-intl-universal';
import { RequestFn, RequestOptions } from '../types';

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

export const buildRequestOptions = <P, T>({
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
    }
    options?.onSuccess?.({ data, params: param?.[0] as P, messageInstance });
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
