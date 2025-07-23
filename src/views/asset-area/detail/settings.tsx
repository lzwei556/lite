import React from 'react';
import { Col, Empty, Space, TableProps } from 'antd';
import intl from 'react-intl-universal';
import { uniq } from 'lodash';
import { DeleteIconButton, EditIconButton, Flex, Grid, Link, Table } from '../../../components';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { Asset, ASSET_PATHNAME, AssetRow, deleteAsset } from '../../asset-common';
import { getByType } from '../../asset-variant';
import { ActionBar } from '../actionBar';

type Column = NonNullable<TableProps<AssetRow>['columns']>[0];

export const Settings = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (asset: AssetRow) => void;
}) => {
  const { asset, onSuccess, onUpdate } = props;
  const { children } = asset;
  const columns: Column[] = [
    {
      title: intl.get('NAME'),
      dataIndex: 'name',
      render: (_, row: AssetRow) => (
        <Link
          to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`}
          style={{ display: 'inline-block', fontSize: 16 }}
          onClick={(e) => {
            if (e.ctrlKey) {
              e.preventDefault();
            }
          }}
        >
          {row.name}
        </Link>
      )
    }
  ];
  const operationColumn: Column = {
    title: intl.get('OPERATION'),
    key: 'action',
    render: (row: AssetRow) => (
      <Space>
        <HasPermission value={Permission.AssetEdit}>
          <EditIconButton onClick={() => onUpdate(row)} />
        </HasPermission>
        <HasPermission value={Permission.AssetDelete}>
          <DeleteIconButton
            confirmProps={{
              description: intl.get('DELETE_SOMETHING_PROMPT', { something: row.name }),
              onConfirm: () => deleteAsset(row.id).then(onSuccess)
            }}
          />
        </HasPermission>
      </Space>
    )
  };

  const renderChildren = (children?: AssetRow[]) => {
    if (!children || children.length === 0) {
      return (
        <Col span={24}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Col>
      );
    }
    const types = uniq(children.map((a) => a.type));
    return types.map((t) => {
      const cols = [...columns];
      if (Asset.Assert.isVibrationRelated(t)) {
        cols.push({
          key: 'motor_type',
          render: ({ attributes }: any) => attributes?.motor_type,
          title: intl.get('motor.motor_type')
        });
        cols.push({
          key: 'rotation_speed',
          render: ({ attributes }: any) => attributes?.rotation_speed,
          title: intl.get('motor.rotation_speed')
        });
        cols.push({
          key: 'variable_frequency_drive',
          render: ({ attributes }: any) =>
            !!attributes?.variable_frequency_drive === true ? intl.get('yes') : intl.get('no'),
          title: intl.get('motor.variable_frequency_drive')
        });
        cols.push({
          key: 'nominal_power',
          render: ({ attributes }: any) => attributes?.nominal_power,
          title: intl.get('motor.nominal_power')
        });
        cols.push({
          key: 'mounting',
          render: ({ attributes }: any) =>
            attributes?.mounting === 1 ? intl.get('horizontal') : intl.get('vertical'),
          title: intl.get('motor.mounting')
        });
        cols.push({
          key: 'bearing_type',
          render: ({ attributes }: any) =>
            attributes?.bearing_type === 1
              ? intl.get('motor.bearing.type.roller')
              : intl.get('motor.bearing.type.journal'),
          title: intl.get('motor.bearing_type')
        });
        cols.push({
          key: 'bearing_model',
          render: ({ attributes }: any) => attributes?.bearing_model,
          title: intl.get('motor.bearing_model')
        });
      }
      cols.push(operationColumn);
      const typeLabel = getByType(t)?.label;

      return (
        <Col span={24} key={t}>
          {types.length === 1 ? (
            <Table
              bordered
              columns={cols}
              dataSource={children
                .filter((a) => a.type === t)
                .map((c) => {
                  delete c.children;
                  return c;
                })}
              pagination={false}
              rowKey={(row) => row.id}
            />
          ) : (
            <Table
              bordered
              columns={cols}
              dataSource={children
                .filter((a) => a.type === t)
                .map((c) => {
                  delete c.children;
                  return c;
                })}
              header={{ title: typeLabel ? intl.get(typeLabel) : t }}
              pagination={false}
              rowKey={(row) => row.id}
            />
          )}
        </Col>
      );
    });
  };

  return (
    <Grid>
      <Col span={24}>
        <Flex>
          <ActionBar {...props} />
        </Flex>
      </Col>
      {renderChildren(children)}
    </Grid>
  );
};
