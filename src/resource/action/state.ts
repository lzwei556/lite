import { ActionState } from '../types';

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
        // 单参数
        await req.runAsync(params);
      }
    }) as any
  };
}
