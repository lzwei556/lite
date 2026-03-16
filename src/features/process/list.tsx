import React from 'react';
import {
  DeleteIconButton,
  EditIconButton,
  IconButton,
  IconButtonProps,
  Table
} from '../../components';
import { useModalBindingsProps } from '../../hooks';
import { CommonProps, sourceIdField, typeField } from './common';
import { BindModal } from './bind-modal';
import { Process, ProcessDTO, transform2Process, unbindAction, useDevices } from './use-services';
import { Space, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { autoFillParameter } from '../../process-type';
import { getDisplayName, Translation } from 'locales/utils';
import { useI18n } from 'providers/i18n';

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
          deleteButtonProps: getDeleteIconButtonProps(
            props.monitoringPoint.assetId,
            process,
            props.onSuccess
          )
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
      description: Translation.get('feedback.prompt.delete'),
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
        tooltipProps: { title: Translation.createSth('process') },
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
  const { language } = useI18n();
  const columns: TableProps<Process>['columns'] = [
    { key: 'typeLabel', dataIndex: 'typeLabel', title: Translation.get(typeField.label) },
    { key: 'sourceIdName', dataIndex: 'sourceIdName', title: Translation.get(sourceIdField.label) }
  ];
  columns.push({
    key: autoFillParameter.targetDeviceId.name.join(),
    dataIndex: 'deviceName',
    title: Translation.get(autoFillParameter.targetDeviceId.label)
  });
  columns.push({
    key: autoFillParameter.fillingCapacity.name.join(),
    dataIndex: 'fillingCapacity',
    title: getDisplayName({
      name: Translation.get(autoFillParameter.fillingCapacity.label),
      lang: language,
      suffix: autoFillParameter.fillingCapacity.unit
    })
  });
  columns.push({
    key: 'operation',
    title: Translation.get('common.operation'),
    render: props.operationCellRender
  });
  return {
    cardProps: {
      title: Translation.get('process'),
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
