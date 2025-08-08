import React from 'react';
import { Col, Space } from 'antd';
import intl from 'react-intl-universal';
import { DeleteIconButton, EditIconButton, Link, Table } from '../../../components';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { ASSET_PATHNAME, AssetRow, deleteAsset } from '../../../asset-common';
import { AlarmLevel } from '../../alarm';
import { categories } from '../flange';
import { flange, tower } from '../constants';

export const ChildrenAttrsTable = ({
  assets,
  operateCellProps
}: {
  assets: AssetRow[];
  operateCellProps: { onSuccess: () => void; onUpdate: (asset: AssetRow) => void };
}) => {
  const nameCol = {
    title: () => intl.get('NAME'),
    dataIndex: 'name',
    key: 'name',
    render: (name: string, row: AssetRow) => (
      <Link to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`} key={`${row.id}-${row.type}`}>
        {name}
      </Link>
    )
  };
  const typeCol = {
    title: () => intl.get('FLANGE_TYPE'),
    dataIndex: ['attributes', 'type'],
    key: 'type',
    render: (type: number) => {
      const label = categories.find((c) => c.value === type)?.label;
      return label ? intl.get(label) : '';
    }
  };
  const indexCol = {
    title: () => intl.get('INDEX_NUMBER'),
    dataIndex: ['attributes', 'index'],
    key: 'index'
  };
  const normalCol = {
    title: () => intl.get('RATING'),
    dataIndex: ['attributes', 'normal'],
    key: 'normal',
    render: (normal: { enabled: boolean; value: string }) => {
      if (normal.enabled) {
        return normal.value;
      } else {
        return intl.get('DISABLED');
      }
    }
  };
  const initialCol = {
    title: () => intl.get('INITIAL_VALUE'),
    dataIndex: ['attributes', 'initial'],
    key: 'initial',
    render: (initial: { enabled: boolean; value: string }) => {
      if (initial.enabled) {
        return initial.value;
      } else {
        return intl.get('DISABLED');
      }
    }
  };
  const infoCol = {
    title: () => intl.get(`leveled.alarm.${AlarmLevel.Minor}`),
    dataIndex: ['attributes', 'info'],
    key: 'info',
    render: (info: { enabled: boolean; value: string }) => {
      if (info.enabled) {
        return info.value;
      } else {
        return intl.get('DISABLED');
      }
    }
  };
  const warnCol = {
    title: () => intl.get(`leveled.alarm.${AlarmLevel.Major}`),
    dataIndex: ['attributes', 'warn'],
    key: 'warn',
    render: (warn: { enabled: boolean; value: string }) => {
      if (warn.enabled) {
        return warn.value;
      } else {
        return intl.get('DISABLED');
      }
    }
  };
  const dangerCol = {
    title: () => intl.get(`leveled.alarm.${AlarmLevel.Critical}`),
    dataIndex: ['attributes', 'danger'],
    key: 'danger',
    render: (danger: { enabled: boolean; value: string }) => {
      if (danger.enabled) {
        return danger.value;
      } else {
        return intl.get('DISABLED');
      }
    }
  };

  const operationColumn = {
    title: intl.get('OPERATION'),
    key: 'action',
    render: (row: AssetRow) => (
      <Space>
        <HasPermission value={Permission.AssetEdit}>
          <EditIconButton onClick={() => operateCellProps.onUpdate(row)} />
        </HasPermission>
        <HasPermission value={Permission.AssetDelete}>
          <DeleteIconButton
            confirmProps={{
              description: intl.get('DELETE_SOMETHING_PROMPT', { something: row.name }),
              onConfirm: () => deleteAsset(row.id).then(operateCellProps.onSuccess)
            }}
          />
        </HasPermission>
      </Space>
    )
  };

  return Array.from(new Set(assets.map((a) => a.type))).map((type) => (
    <Col span={24} key={type}>
      <Table
        cardProps={{
          title: intl.get(type === flange.type ? flange.label : tower.label)
        }}
        columns={
          type === tower.type
            ? [nameCol, indexCol, operationColumn]
            : [
                nameCol,
                typeCol,
                indexCol,
                normalCol,
                initialCol,
                infoCol,
                warnCol,
                dangerCol,
                operationColumn
              ]
        }
        dataSource={assets.filter((a) => a.type === type)}
        rowKey={(row) => row.id}
      />
    </Col>
  ));
};
