import React from 'react';
import { ActionConfig, ActionModalOpen } from '../types';

export function useActionModal<T, A extends Record<string, ActionConfig>>(actions?: A) {
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
