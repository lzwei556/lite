import { useCreate, useDelete, useUpdate } from './data';
import { createActionState } from './state';
import { useActionModal } from './modal';
import { ActionConfig, BaseEntity } from '../types';

const noop = async () => {};

export type ActionControllerOptions<T extends BaseEntity, C = any, U = any> = {
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
  const { api, actions: userActions } = options;

  const createReq = useCreate(api?.create ?? noop, {
    onSuccess: () => {
      actions.create.onSuccess?.();
    }
  });
  const updateReq = useUpdate(api?.update ?? noop, {
    onSuccess: () => {
      actions.update.onSuccess?.();
    }
  });
  const deleteReq = useDelete(api?.delete ?? noop, {
    onSuccess: ({ params }) => {
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
        sort: 4,
        state: updateState
      }
    }),

    ...(deleteState && {
      delete: {
        label: 'Delete',
        position: 'row',
        sort: 5,
        state: deleteState
      }
    })
  };

  const actions = mergeActions(baseActions, userActions);

  const { open, close, modalNode, current } = useActionModal<T, typeof actions>(actions);

  return { actions, open, close, modalNode, current };
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
