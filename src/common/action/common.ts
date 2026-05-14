import { ButtonProps } from 'antd';
import React from 'react';
import { useCreate, useDelete, useUpdate } from 'hooks/data';
import { PageResult } from 'types/page';

type IdType = number;

export type BaseEntity = {
  id: IdType;
};

export type ActionState<TParams = {}> = {
  loading?: boolean;
  submit: (params?: TParams) => Promise<void>;
};

export type ActionModalContext<TRecord = any, TParams = {}> = {
  open: boolean;
  record?: TRecord;
  close: () => void;
} & ActionState<TParams>;

type ActionPosition = 'toolbar' | 'row';

export type ActionConfig = {
  can?: boolean;
  label?: string;
  buttonProps?: ButtonProps;
  state?: ActionState<any>;
  modal?: (ctx: ActionModalContext<any>) => React.ReactNode;
  onSuccess?: (params?: any) => void;
  position?: ActionPosition;
  render?: (ctx: {
    key: string;
    action: ActionConfig;
    record?: any;
    open: (key: string, record?: any) => void;
  }) => React.ReactNode;
  sort?: number;
  hidden?: boolean | ((record?: any) => boolean);
};

const noop = async () => {};

export type ActionControllerOptions<T extends BaseEntity, C = any, U = any> = {
  list: {
    data?: T[] | PageResult<T>;
    loading?: boolean;
    refresh: () => void;
  };
  api?: {
    create?: (data: C) => Promise<any>;
    update?: (params: { id: T['id']; data: U }) => Promise<any>;
    delete?: (params: { id: T['id'] }) => Promise<any>;
  };
  actions?: Record<string, ActionConfig>;
};

export function useActionController<T extends BaseEntity, C = any, U = any>(
  options: ActionControllerOptions<T, C, U>
) {
  const { list, api, actions: userActions } = options;

  const createReq = useCreate(api?.create ?? noop, {
    onSuccess: () => {
      list.refresh();
      actions.create.onSuccess?.();
    }
  });
  const updateReq = useUpdate(api?.update ?? noop, {
    onSuccess: () => {
      list.refresh();
      actions.update.onSuccess?.();
    }
  });
  const deleteReq = useDelete(api?.delete ?? noop, {
    onSuccess: ({ params }) => {
      list.refresh();
      actions.delete.onSuccess?.(params);
    }
  });

  const createState = api?.create ? createActionState(createReq) : undefined;

  const updateState = api?.update ? createActionState(updateReq) : undefined;

  const deleteState = api?.delete ? createActionState(deleteReq) : undefined;

  const baseActions: Record<string, ActionConfig> = {
    ...(createState && {
      create: {
        label: 'Create',
        position: 'toolbar',
        state: createState
      }
    }),

    ...(updateState && {
      update: {
        label: 'Edit',
        position: 'row',
        sort: 9,
        state: updateState
      }
    }),

    ...(deleteState && {
      delete: {
        label: 'Delete',
        position: 'row',
        sort: 10,
        state: deleteState
      }
    })
  };

  const actions = mergeActions(baseActions, userActions);

  const { open, close, modalNode, current } = useActionModal<T, typeof actions>(actions);

  return {
    dataSource: list.data,
    loading: list.loading,

    actions,
    open,
    close,

    modalNode,
    current,

    refresh: list.refresh
  };
}

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

function mergeActions<T extends Record<string, ActionConfig>>(base?: T, custom?: Partial<T>): T {
  const result = { ...base } as T;

  if (!custom) {
    return result;
  }

  for (const key in custom) {
    result[key] = {
      ...result[key],
      ...custom[key]
    };
  }

  return result;
}

export type ActionModalOpen<T, A extends Record<string, ActionConfig>> = (
  key: keyof A,
  record?: T | undefined
) => void;

function useActionModal<T, A extends Record<string, ActionConfig>>(actions?: A) {
  const safeActions = React.useMemo(() => actions ?? ({} as A), [actions]);

  const [current, setCurrent] = React.useState<{
    key: keyof A;
    record?: T;
  } | null>(null);

  const open: ActionModalOpen<T, A> = React.useCallback(
    (key, record) => {
      if (!safeActions[key]) return;

      setCurrent({ key, record });
    },
    [safeActions]
  );

  const close = React.useCallback(() => {
    setCurrent(null);
  }, []);

  const modalNode = React.useMemo(() => {
    if (!current) return null;

    const action = safeActions[current.key];
    if (!action?.modal) return null;

    const submitWithClose = async (params?: any) => {
      await action.state?.submit(params);
      close();
    };

    return action.modal({
      open: true,
      record: current.record,
      close,
      submit: submitWithClose,
      loading: action.state?.loading
    });
  }, [current, safeActions, close]);

  return {
    open,
    close,
    modalNode,
    current
  };
}
