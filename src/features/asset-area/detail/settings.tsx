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
import { Asset, ASSET_PATHNAME, AssetRow, deleteAsset } from '../../../asset-common';
import { getByType, rotationSpeed, envBand, powerFreq, gearTeeth } from '../../../asset-variant';
import { ActionBar } from '../actionBar';
import { getDisplayName } from '../../../utils';
import { Language, useLocaleContext } from '../../../localeProvider';
import { CanAccess, Permission } from '../../../providers/access-control';

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
        <CanAccess {...Permission.AssetEdit}>
          <EditIconButton onClick={() => onUpdate(row)} />
        </CanAccess>
        <CanAccess {...Permission.AssetDelete}>
          <DeleteIconButton
            confirmProps={{
              description: intl.get('DELETE_SOMETHING_PROMPT', { something: row.name }),
              onConfirm: () => deleteAsset(row.id).then(onSuccess)
            }}
          />
        </CanAccess>
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
          key: rotationSpeed.name,
          render: ({ attributes }: any) => attributes?.[rotationSpeed.name],
          title: getDisplayName({
            name: intl.get(rotationSpeed.label),
            lang,
            suffix: rotationSpeed.unit
          })
        });
        cols.push({
          key: envBand.name,
          render: ({ attributes }: any) => attributes?.[envBand.name],
          title: getDisplayName({
            name: intl.get(envBand.label),
            lang,
            suffix: envBand.unit
          })
        });
        cols.push({
          key: powerFreq.name,
          render: ({ attributes }: any) => attributes?.[powerFreq.name],
          title: getDisplayName({
            name: intl.get(powerFreq.label),
            lang,
            suffix: powerFreq.unit
          })
        });
        cols.push({
          key: gearTeeth.name,
          render: ({ attributes }: any) => attributes?.[gearTeeth.name],
          title: getDisplayName({
            name: intl.get(gearTeeth.label),
            lang,
            suffix: gearTeeth.unit
          })
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
      <CanAccess {...Permission.AssetAdd}>
        <Col span={24}>
          <Flex>
            <Button.Group>
              <ActionBar {...props} />
            </Button.Group>
          </Flex>
        </Col>
      </CanAccess>
      <Col span={24}>{renderAssets(language, children)}</Col>
    </Grid>
  );
};
