import React from 'react';
import { Pagination, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, Link } from '../../../components';
import { getValue, roundValue, truncate } from '../../../utils/format';
import { ASSET_PATHNAME, AssetRow, Point } from '../../asset-common';
import { Icon } from '../../home/icon';

export const OverviewCard = ({ asset }: { asset: AssetRow }) => {
  const { id, monitoringPoints = [], name, type } = asset;
  const items = monitoringPoints.map(({ name, data, properties, type }) => {
    const property = Point.getPropertiesByType(properties, type).filter((p) => p.first)?.[0];
    const key =
      property.fields && property.fields.length > 1
        ? property.fields[property.fields.length - 1].key
        : property.key;
    let value = NaN;
    if (data && data.values && data.values[key] !== undefined) {
      value = data.values[key] as number;
    }
    return {
      name: <span title={name}>{truncate(name, 20)}</span>,
      value: property && (
        <Space>
          <Typography.Text type='secondary'>{intl.get(property.name)}</Typography.Text>
          <strong>{getValue(roundValue(value, property.precision))}</strong>
        </Space>
      )
    };
  });
  const [page, setPage] = React.useState(1);
  return (
    <Card styles={{ body: { padding: 24, height: 240 } }}>
      <Card.Meta
        avatar={<Icon node={asset} />}
        description={
          items.length > 0 ? (
            <>
              <Descriptions
                items={items
                  .slice(4 * (page - 1), 4 * page)
                  .map(({ name, value }) => ({ label: name, children: value }))}
              />
              <Pagination
                align='end'
                hideOnSinglePage={true}
                onChange={setPage}
                pageSize={4}
                simple={{ readOnly: true }}
                size='small'
                style={{ marginTop: 12 }}
                total={items.length}
              />
            </>
          ) : (
            <></>
          )
        }
        title={<Link to={`/${ASSET_PATHNAME}/${id}-${type}`}>{name}</Link>}
      />
    </Card>
  );
};
