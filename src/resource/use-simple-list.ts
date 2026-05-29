import { useNotificationContext } from 'providers/notification';
import { RequestFn, RequestOptions } from './types';
import { useRequest } from 'ahooks';
import { buildRequestOptions } from './action/data';

export const useSimpleList = <P, T>(
  requestFn: RequestFn<P, T[]>,
  options?: RequestOptions<T[], P>
) => {
  const { messageInstance } = useNotificationContext();

  const request = useRequest(
    requestFn,
    buildRequestOptions({
      options,
      messageInstance
    })
  );

  return {
    ...request,
    dataSource: request.data ?? [],
    total: request.data?.length ?? 0,
    refresh: request.refresh
  };
};
