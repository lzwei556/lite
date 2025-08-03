import React from 'react';
import { Pagination, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card, Flex, Link } from '../../../components';
import { getValue, roundValue } from '../../../utils';
import { ASSET_PATHNAME, AssetRow, Point } from '../../../asset-common';
import { Icon } from '../../../views/home/icon';

export const OverviewCard = ({ asset }: { asset: AssetRow }) => {
  const { id, monitoringPoints = [], name, type } = asset;
  const items = monitoringPoints.map(({ id, name, data, properties, type }) => {
    const property = Point.getPropertiesByType(type, properties).filter((p) => p.first)?.[0];
    let value = NaN;
    if (property) {
      const key =
        property.fields && property.fields.length > 1
          ? property.fields[property.fields.length - 1].key
          : property.key;

      if (data && data.values && data.values[key] !== undefined) {
        value = data.values[key] as number;
      }
    }
    return { id, name, type, value, property };
  });
  const [page, setPage] = React.useState(1);
  const pageSize = 4;
  const pagedItems = items.slice(pageSize * (page - 1), pageSize * page);
  return (
    <Card
      actions={[
        <Pagination
          align='end'
          onChange={setPage}
          pageSize={pageSize}
          simple={{ readOnly: true }}
          size='small'
          total={items.length}
        />
      ]}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      styles={{ body: { flex: 1, paddingBlock: 24 } }}
    >
      <Card.Meta
        avatar={<Icon node={asset} />}
        description={
          pagedItems.length > 0 &&
          pagedItems.map(({ id, name, type, value, property }, i) => (
            <Card
              key={name}
              style={{
                marginTop: i === 0 ? 20 : 0,
                borderRadius: 4,
                fontSize: 12,
                backgroundColor: '#f0f0f0'
              }}
              styles={{
                body: {
                  marginBottom: i === pageSize - 1 ? 0 : 8,
                  marginTop: 8,
                  paddingBlock: 4,
                  paddingInline: 8
                }
              }}
            >
              <Flex align='center' justify='space-between'>
                <Typography.Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ margin: 0, paddingRight: 8, lineHeight: 1.35 }}
                >
                  <Link to={`/${ASSET_PATHNAME}/${id}-${type}`}>{name}</Link>
                </Typography.Paragraph>
                <Space direction='vertical' size={0}>
                  <Typography.Text style={{ whiteSpace: 'nowrap' }} type='secondary'>
                    {property ? intl.get(property.name) : '-'}
                  </Typography.Text>
                  {getValue(roundValue(value, property?.precision), property?.unit)}
                </Space>
              </Flex>
            </Card>
          ))
        }
        title={
          <Link to={`/${ASSET_PATHNAME}/${id}-${type}`} title={name}>
            {name}
          </Link>
        }
      />
    </Card>
  );
};
