import { ModalProps } from 'antd';
import { PageResult } from './page';

export type ModalFormProps = ModalProps & { onSuccess: () => void };

export type FormSubmittingProps<T> = {
  loading: boolean;
  handleSubmit: (values: T) => void;
};

export type ListProps<T extends { id: number }> = {
  dataSource?: T[] | PageResult<T[]>;
  fetch?: (params?: any) => Promise<T[] | PageResult<T[]>>;
  onDelete: (id: number) => void;
  openCreate: () => void;
  openUpdate: (editting: T) => void;
  createFormModal: React.ReactNode;
  updateFormModal: React.ReactNode;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};
