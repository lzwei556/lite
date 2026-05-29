import { ButtonProps } from "antd";
import { MessageInstance } from "antd/es/message/interface";

export type RequestFn<P, R> = (params: P) => Promise<R>;
export type RequestOptions<TData, TParams> = {
  manual?: boolean;
  defaultParams?: TParams;
  ready?: boolean;
  refreshDeps?: any[];
  cacheKey?: string;
  staleTime?: number;
  onSuccess?: (params: { data: TData; params: TParams; messageInstance?: MessageInstance }) => void;
  onError?: (e: any) => void;
};

type IdType = number;

export type BaseEntity = {
  id: IdType;
};

type ActionPosition = 'toolbar' | 'row';

export type ActionState<TParams = {}> = {
  loading?: boolean;
  submit: (params?: TParams) => Promise<void>;
};

export type ActionModalContext<TRecord = any, TParams = {}> = {
  open: boolean;
  record?: TRecord;
  close: () => void;
} & ActionState<TParams>;

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

export type ActionModalOpen<T, A extends Record<string, ActionConfig>> = (
  key: keyof A,
  record?: T | undefined
) => void;
