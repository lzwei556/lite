import { ButtonProps, ModalProps } from 'antd';
import { PageResult } from './page';
import React from 'react';

export type ModalFormProps = ModalProps & { onSuccess: () => void };

export type IdType = number;

export type BaseEntity = {
  id: IdType;
};

export type SubmitHandler<TParams = void> = TParams extends void
  ? () => Promise<void> | void
  : (params: TParams) => Promise<void> | void;

export type ActionState<TParams = void> = {
  loading?: boolean;
  submit: SubmitHandler<TParams>;
};

export type ActionConfig = {
  can?: boolean;
  label?: string;
  buttonProps?: ButtonProps;
  state?: ActionState<any>;
  modal?: (ctx: { open: boolean; record?: any; close: () => void }) => React.ReactNode;
};

export type Actions = Record<string, ActionConfig>;

export type ListProps<T extends BaseEntity> = {
  dataSource?: T[] | PageResult<T>;
  actions?: Actions;
};

export function useActionModal<T extends BaseEntity, A extends Record<string, ActionConfig>>(
  actions: A
) {
  const [current, setCurrent] = React.useState<{
    key: keyof A;
    record?: T;
  } | null>(null);

  const open = React.useCallback(<K extends keyof A>(key: K, record?: T) => {
    setCurrent({ key, record });
  }, []);

  const close = React.useCallback(() => {
    setCurrent(null);
  }, []);

  const modalNode = React.useMemo(() => {
    if (!current) return null;

    const action = actions[current.key];
    if (!action?.modal) return null;

    return action.modal({
      open: true,
      record: current.record,
      close
    });
  }, [current, actions, close]);

  return {
    open,
    close,
    modalNode,
    current
  };
}
