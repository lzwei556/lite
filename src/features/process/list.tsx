import React from 'react';
import {
  DeleteIconButton,
  EditIconButton,
  IconButton,
  IconButtonProps,
  Table
} from '../../components';
import { useModalBindingsProps } from '../../hooks';
import { CommonProps, sourceId, type } from './common';
import { BindModal } from './bind-modal';
import intl from 'react-intl-universal';
import { Process, ProcessDTO, transform2Process, unbindAction, useDevices } from './use-services';
import { Space, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { autoFillParameter } from '../../process-type';
import { getDisplayName } from '../../utils';
import { useLocaleContext } from '../../localeProvider';

export const ProcessList = (props: CommonProps) => {
  const { data: devices = [] } = useDevices();
  const { trigger, modal } = useBindProps({ ...props, devices });
  const tableProps = useTableProps({
    ...props,
    devices,
    extra: <IconButton icon={<PlusOutlined />} {...trigger.bindIconButtonProps} />,
    operationCellRender: (_: string, process: ProcessDTO) => (
      <OperationCell
        {...{
          editButtonProps: trigger.getEditIconButtonProps(process),
          deleteButtonProps: getDeleteIconButtonProps(props.id, process, props.onSuccess)
        }}
      />
    )
  });
  return (
    <>
      <Table {...tableProps} />
      {trigger.open && <BindModal {...modal} />}
    </>
  );
};

const OperationCell = ({
  editButtonProps,
  deleteButtonProps
}: {
  editButtonProps: { onClick: React.MouseEventHandler<HTMLElement> };
  deleteButtonProps: { confirmProps: any };
}) => {
  return (
    <Space>
      <EditIconButton {...editButtonProps} />
      <DeleteIconButton {...deleteButtonProps} />
    </Space>
  );
};

const getDeleteIconButtonProps = (assetId: number, process: ProcessDTO, onSuccess: () => void) => {
  return {
    confirmProps: {
      description: intl.get('delete.process.prompt'),
      onConfirm: () => unbindAction(assetId, process.id).then(onSuccess)
    }
  };
};

const useBindProps = (props: Omit<CommonProps, 'process'>) => {
  const [open, setOpen] = React.useState(false);
  const [process, setProcess] = React.useState<ProcessDTO>();

  const reset = () => {
    setOpen(false);
    setProcess(undefined);
  };

  return {
    trigger: {
      open,
      bindIconButtonProps: {
        onClick: () => setOpen(true),
        tooltipProps: { title: intl.get('ADD_SOMETHING', { something: intl.get('process') }) },
        type: 'primary'
      } as IconButtonProps,
      getEditIconButtonProps: (process: ProcessDTO) => {
        return {
          onClick: () => {
            setOpen(true);
            setProcess(process);
          }
        };
      }
    },
    modal: {
      ...props,
      process,
      ...useModalBindingsProps({
        open,
        onCancel: () => reset()
      }),
      onSuccess: () => {
        reset();
        props.onSuccess();
      }
    }
  };
};

const useTableProps = (
  props: CommonProps & {
    extra: React.ReactNode;
    operationCellRender: (_: string, process: Process) => JSX.Element;
  }
) => {
  const { language } = useLocaleContext();
  const columns: TableProps<Process>['columns'] = [
    { key: 'typeLabel', dataIndex: 'typeLabel', title: intl.get(type.label) },
    { key: 'sourceIdName', dataIndex: 'sourceIdName', title: intl.get(sourceId.label) }
  ];
  columns.push({
    key: autoFillParameter.targetDeviceId.name.join(),
    dataIndex: 'deviceName',
    title: intl.get(autoFillParameter.targetDeviceId.label)
  });
  columns.push({
    key: autoFillParameter.fillingCapacity.name.join(),
    dataIndex: 'fillingCapacity',
    title: getDisplayName({
      name: intl.get(autoFillParameter.fillingCapacity.label),
      lang: language,
      suffix: autoFillParameter.fillingCapacity.unit
    })
  });
  columns.push({
    key: 'operation',
    title: intl.get('OPERATION'),
    render: props.operationCellRender
  });
  return {
    cardProps: {
      title: intl.get('process'),
      extra: props.extra
    },
    columns,
    dataSource: props.processList.map((p) =>
      transform2Process(
        p,
        (id) => props.monitoringPoints.find((m) => m.id === id)?.name ?? `${id}`,
        (id) => props.devices?.find((d) => d.id === id)?.name ?? `${id}`
      )
    ),
    renderKey: (p: Process) => p.id
  };
};
