import { MinusCircleOutlined } from '@ant-design/icons';
import { FormListFieldData } from 'antd';
import { IconButton } from 'components';
import { Rule } from 'domains/alarm-rule';
import React from 'react';
import intl from 'react-intl-universal';

type ColumnRender = (index: number) => React.ReactNode;

export const getRuleColumns = ({
  onRemove,
  renderNameFormItem,
  renderIndexFormItem,
  renderDurationFormItem,
  renderConditionFormItem,
  renderSeverityFormItem
}: {
  onRemove?: (index: number) => void;
  renderNameFormItem: ColumnRender;
  renderIndexFormItem: ColumnRender;
  renderDurationFormItem: ColumnRender;
  renderConditionFormItem: ColumnRender;
  renderSeverityFormItem: ColumnRender;
}) => {
  const operationColumn = {
    key: 'operation',
    title: intl.get('REMOVE'),
    width: 60,
    render: (_: Rule, row: FormListFieldData) => (
      <IconButton
        disabled={row.name === 0}
        icon={<MinusCircleOutlined />}
        size='small'
        type='text'
        onClick={() => onRemove?.(row.name)}
      />
    )
  };
  const columns = [
    {
      key: 'name',
      title: intl.get('NAME'),
      width: 120,
      render: (_: Rule, row: FormListFieldData) => renderNameFormItem(row.name)
    },
    {
      key: 'property',
      title: intl.get('INDEX'),
      width: 150,
      render: (_: Rule, row: FormListFieldData) => renderIndexFormItem(row.name)
    },
    {
      key: 'duration',
      title: intl.get('alarm_group.consecutive_count'),
      width: 60,
      render: (_: Rule, row: FormListFieldData) => renderDurationFormItem(row.name)
    },
    {
      key: 'condition',
      title: intl.get('CONDITION'),
      width: 180,
      render: (_: Rule, row: FormListFieldData) => renderConditionFormItem(row.name)
    },
    {
      key: 'severity',
      title: intl.get('SEVERITY'),
      width: 80,
      render: (_: Rule, row: FormListFieldData) => renderSeverityFormItem(row.name)
    }
  ];
  return onRemove ? [...columns, operationColumn] : columns;
};
