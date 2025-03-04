import React from 'react';
import { Button, Col, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Grid, Table } from '../../../components';
import { SelfLink } from '../../../components/selfLink';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { ASSET_PATHNAME, AssetRow, deleteAsset } from '../../asset-common';
import { categories } from '../flange';
import { tower } from '../constants';
import { AlarmLevel, getLabelByValue } from '../../alarm';

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
    width: 240,
    render: (name: string, row: AssetRow) => (
      <SelfLink to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`} key={`${row.id}-${row.type}`}>
        {name}
      </SelfLink>
    )
  };
  const typeCol = {
    title: () => intl.get('FLANGE_TYPE'),
    dataIndex: ['attributes', 'type'],
    key: 'type',
    render: (type: number) => {
      const label = categories.find((c) => c.value === type)?.label;
      return label ? intl.get(label) : '';
    },
    width: 120
  };
  const indexCol = {
    title: () => intl.get('INDEX_NUMBER'),
    dataIndex: ['attributes', 'index'],
    key: 'index',
    width: 120
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
    },
    width: 120
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
    },
    width: 120
  };
  const infoCol = {
    title: () =>
      intl.get('leveled.alarm', {
        alarmLevel: intl.get(getLabelByValue(AlarmLevel.Minor))
      }),
    dataIndex: ['attributes', 'info'],
    key: 'info',
    render: (info: { enabled: boolean; value: string }) => {
      if (info.enabled) {
        return info.value;
      } else {
        return intl.get('DISABLED');
      }
    },
    width: 120
  };
  const warnCol = {
    title: () =>
      intl.get('leveled.alarm', {
        alarmLevel: intl.get(getLabelByValue(AlarmLevel.Major))
      }),
    dataIndex: ['attributes', 'warn'],
    key: 'warn',
    render: (warn: { enabled: boolean; value: string }) => {
      if (warn.enabled) {
        return warn.value;
      } else {
        return intl.get('DISABLED');
      }
    },
    width: 120
  };
  const dangerCol = {
    title: () =>
      intl.get('leveled.alarm', {
        alarmLevel: intl.get(getLabelByValue(AlarmLevel.Critical))
      }),
    dataIndex: ['attributes', 'danger'],
    key: 'danger',
    render: (danger: { enabled: boolean; value: string }) => {
      if (danger.enabled) {
        return danger.value;
      } else {
        return intl.get('DISABLED');
      }
    },
    width: 120
  };

  const operationColumn = {
    title: intl.get('OPERATION'),
    key: 'action',
    render: (row: AssetRow) => (
      <Space>
        <HasPermission value={Permission.AssetEdit}>
          <Button
            type='text'
            size='small'
            title={intl.get('EDIT_SOMETHING', { something: intl.get('ASSET') })}
          >
            <EditOutlined onClick={() => operateCellProps.onUpdate(row)} />
          </Button>
        </HasPermission>
        <HasPermission value={Permission.AssetDelete}>
          <Popconfirm
            title={intl.get('DELETE_SOMETHING_PROMPT', { something: row.name })}
            onConfirm={() => {
              deleteAsset(row.id).then(operateCellProps.onSuccess);
            }}
          >
            <Button
              type='text'
              danger={true}
              size='small'
              title={intl.get('DELETE_SOMETHING', {
                something: intl.get('ASSET')
              })}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </HasPermission>
      </Space>
    ),
    width: 150
  };

  return (
    <Grid>
      {Array.from(new Set(assets.map((a) => a.type))).map((type) => (
        <Col span={24} key={type}>
          <Table
            cardProps={{ styles: { body: { padding: 0 } } }}
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
      ))}
    </Grid>
  );
};
