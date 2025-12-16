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
import { ActionBar } from '../actionBar';
import { getDisplayName, getOptionLabelByValue } from '../../../utils';
import { Language, useLocaleContext } from '../../../localeProvider';
import { AssetCategory } from '../../../asset-category';

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
      const settings = AssetCategory.Key.getSettings(t);
      if (settings.length > 0) {
        const settingsColumns = settings[0].fields.map(({ label, name, options, source, unit }) => {
          const common = {
            dataIndex: source === 'motor' ? [`attributes`, 'motor', name] : [`attributes`, name],
            key: name,
            title: () => getDisplayName({ name: intl.get(label), lang, suffix: unit })
          };
          return options
            ? {
                ...common,
                render: (value: string) => intl.get(getOptionLabelByValue(options, value)).d(value)
              }
            : common;
        });
        cols.push(...settingsColumns);
      }

      cols.push(operationColumn);
      const typeLabel = AssetCategory.Key.getlabelPlural(t);

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
