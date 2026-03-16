import React from 'react';
import { Col, Space } from 'antd';
import { Translation } from 'locales/utils';
import { DeleteIconButton, EditIconButton, Link, Table } from '../../../components';
import { ASSET_PATHNAME, AssetRow, deleteAsset } from '../../../asset-common';
import { AlarmLevel, getLabelByValue } from '../../alarm';
import { categories } from '../flange';
import { flange, tower } from '../constants';
import { CanAccess, Permission } from '../../../providers/access-control';

export const ChildrenAttrsTable = ({
  assets,
  operateCellProps
}: {
  assets: AssetRow[];
  operateCellProps: { onSuccess: () => void; onUpdate: (asset: AssetRow) => void };
}) => {
  const nameCol = {
    title: () => Translation.get('common.name'),
    dataIndex: 'name',
    key: 'name',
    render: (name: string, row: AssetRow) => (
      <Link to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`} key={`${row.id}-${row.type}`}>
        {name}
      </Link>
    )
  };
  const typeCol = {
    title: () => Translation.get('asset.flange.type'),
    dataIndex: ['attributes', 'type'],
    key: 'type',
    render: (type: number) => {
      const label = categories.find((c) => c.value === type)?.label;
      return label ? Translation.get(label) : '';
    }
  };
  const indexCol = {
    title: () => Translation.get('common.index'),
    dataIndex: ['attributes', 'index'],
    key: 'index'
  };
  const normalCol = {
    title: () => Translation.get('asset.flange.rating'),
    dataIndex: ['attributes', 'normal'],
    key: 'normal',
    render: (normal: { enabled: boolean; value: string }) => {
      if (normal.enabled) {
        return normal.value;
      } else {
        return Translation.get('common.disabled');
      }
    }
  };
  const initialCol = {
    title: () => Translation.get('asset.flange.initial'),
    dataIndex: ['attributes', 'initial'],
    key: 'initial',
    render: (initial: { enabled: boolean; value: string }) => {
      if (initial.enabled) {
        return initial.value;
      } else {
        return Translation.get('common.disabled');
      }
    }
  };
  const infoCol = {
    title: () => Translation.leveledAlarm(getLabelByValue(AlarmLevel.Minor)),
    dataIndex: ['attributes', 'info'],
    key: 'info',
    render: (info: { enabled: boolean; value: string }) => {
      if (info.enabled) {
        return info.value;
      } else {
        return Translation.get('common.disabled');
      }
    }
  };
  const warnCol = {
    title: () => Translation.leveledAlarm(getLabelByValue(AlarmLevel.Major)),
    dataIndex: ['attributes', 'warn'],
    key: 'warn',
    render: (warn: { enabled: boolean; value: string }) => {
      if (warn.enabled) {
        return warn.value;
      } else {
        return Translation.get('common.disabled');
      }
    }
  };
  const dangerCol = {
    title: () => Translation.leveledAlarm(getLabelByValue(AlarmLevel.Critical)),
    dataIndex: ['attributes', 'danger'],
    key: 'danger',
    render: (danger: { enabled: boolean; value: string }) => {
      if (danger.enabled) {
        return danger.value;
      } else {
        return Translation.get('common.disabled');
      }
    }
  };

  const operationColumn = {
    title: Translation.get('common.operation'),
    key: 'action',
    render: (row: AssetRow) => (
      <Space>
        <CanAccess {...Permission.AssetEdit}>
          <EditIconButton onClick={() => operateCellProps.onUpdate(row)} />
        </CanAccess>
        <CanAccess {...Permission.AssetDelete}>
          <DeleteIconButton
            confirmProps={{
              description: Translation.get('feedback.prompt.delete'),
              onConfirm: () => deleteAsset(row.id).then(operateCellProps.onSuccess)
            }}
          />
        </CanAccess>
      </Space>
    )
  };

  return Array.from(new Set(assets.map((a) => a.type))).map((type) => (
    <Col span={24} key={type}>
      <Table
        cardProps={{
          title: Translation.get(type === flange.type ? 'asset.flanges' : 'asset.towers')
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
