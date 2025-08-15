import React from 'react';
import { Button, Col, Empty, Space, TableProps } from 'antd';
import intl from 'react-intl-universal';
import { uniq } from 'lodash';
import {
  Card,
  DeleteIconButton,
  EditIconButton,
  Flex,
  Grid,
  Link,
  Table
} from '../../../components';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { Asset, ASSET_PATHNAME, AssetRow, deleteAsset } from '../../../asset-common';
import {
  BearingModel,
  BearingType,
  getByType,
  MotorType,
  Mounting,
  NominalPower,
  RotationSpeed,
  VariableFrequencyDrive
} from '../../../asset-variant';
import { ActionBar } from '../actionBar';
import { getDisplayName, getOptionLabelByValue } from '../../../utils';
import { Language, useLocaleContext } from '../../../localeProvider';

type Column = NonNullable<TableProps<AssetRow>['columns']>[0];

export const Settings = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (asset: AssetRow) => void;
}) => {
  const { asset, onSuccess, onUpdate } = props;
  const { language } = useLocaleContext();
  const { children } = asset;
  const nameColun: Column = {
    title: intl.get('NAME'),
    dataIndex: 'name',
    render: (_, row: AssetRow) => (
      <Link
        style={{ display: 'inline-block', minWidth: 160 }}
        to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`}
      >
        {row.name}
      </Link>
    )
  };
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

  const renderAssets = (language: Language, children?: AssetRow[]) => {
    if (!children || children.length === 0) {
      return (
        <Card title={intl.get('ASSET')}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    } else if (children.every((asset) => Asset.Assert.isArea(asset.type))) {
      return (
        <Table
          cardProps={{ title: intl.get('ASSET') }}
          columns={[nameColun, operationColumn]}
          dataSource={children.map(({ children, ...rest }) => rest)}
          pagination={false}
          rowKey={(row) => row.id}
        />
      );
    } else {
      return renderSpecificAssetChildren(children, language);
    }
  };

  const renderSpecificAssetChildren = (children: AssetRow[], lang: Language) => {
    const types = uniq(children.map((a) => a.type));
    return types.map((t, i) => {
      const cols = [nameColun];
      if (Asset.Assert.isVibrationRelated(t)) {
        cols.push({
          key: MotorType.name,
          render: ({ attributes }: any) => attributes?.[MotorType.name],
          title: intl.get(MotorType.label)
        });
        cols.push({
          key: RotationSpeed.name,
          render: ({ attributes }: any) => attributes?.[RotationSpeed.name],
          title: getDisplayName({
            name: intl.get(RotationSpeed.label),
            lang,
            suffix: RotationSpeed.unit
          })
        });
        cols.push({
          key: VariableFrequencyDrive.name,
          render: ({ attributes }: any) => {
            const value = attributes?.[VariableFrequencyDrive.name];
            const label = getOptionLabelByValue(VariableFrequencyDrive.options!, value);
            return intl.get(label).d(label);
          },
          title: intl.get(VariableFrequencyDrive.label)
        });
        cols.push({
          key: NominalPower.name,
          render: ({ attributes }: any) => attributes?.[NominalPower.name],
          title: getDisplayName({
            name: intl.get(NominalPower.label),
            lang,
            suffix: NominalPower.unit
          })
        });
        cols.push({
          key: Mounting.name,
          render: ({ attributes }: any) => {
            const value = attributes?.[Mounting.name];
            const label = getOptionLabelByValue(Mounting.options!, value);
            return intl.get(label).d(label);
          },
          title: intl.get(Mounting.label)
        });
        cols.push({
          key: BearingType.name,
          render: ({ attributes }: any) => {
            const value = attributes?.[BearingType.name];
            const label = getOptionLabelByValue(BearingType.options!, value);
            return intl.get(label).d(label);
          },
          title: (
            <span style={{ display: 'inline-block', minWidth: 120 }}>
              {intl.get(BearingType.label)}
            </span>
          )
        });
        cols.push({
          key: BearingModel.name,
          render: ({ attributes }: any) => attributes?.[BearingModel.name],
          title: intl.get(BearingModel.label)
        });
      }
      cols.push(operationColumn);
      const typeLabel = getByType(t)?.labelPlural;

      return (
        <Table
          cardProps={{
            style: { marginTop: i !== 0 ? 16 : undefined },
            title: typeLabel ? intl.get(typeLabel) : intl.get('ASSET')
          }}
          columns={cols}
          dataSource={children.filter((a) => a.type === t)}
          pagination={false}
          rowKey={(row) => row.id}
        />
      );
    });
  };

  return (
    <Grid>
      <Col span={24}>
        <Flex>
          <Button.Group>
            <ActionBar {...props} />
          </Button.Group>
        </Flex>
      </Col>
      <Col span={24}>{renderAssets(language, children)}</Col>
    </Grid>
  );
};
