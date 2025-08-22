import React from 'react';
import { Col, Statistic, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card, Flex, Grid, Link } from '../../../components';
import { Asset, ASSET_PATHNAME, AssetImage, AssetRow, AssetStatusTag } from '../../../asset-common';
import { useGlobalStyles } from '../../../styles';

export const OverviewCard = ({ asset }: { asset: AssetRow }) => {
  const { id, name, type, statistics } = asset;
  const { colorLayoutBgStyle } = useGlobalStyles();
  return (
    <Card
      cover={
        <div style={{ position: 'relative' }}>
          <AssetImage
            asset={asset}
            preview={false}
            height={210}
            width='100%'
            style={{
              ...colorLayoutBgStyle,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              objectFit: 'contain',
              paddingTop: 16
            }}
          />
          <div style={{ position: 'absolute', top: 16, left: 16, right: 8 }}>
            <Flex justify='space-between'>
              <Typography.Text ellipsis={true}>
                <Link to={`/${ASSET_PATHNAME}/${id}-${type}`} title={name}>
                  {name}
                </Link>
              </Typography.Text>
              <AssetStatusTag status={asset.alertLevel ?? 0} />
            </Flex>
          </div>
        </div>
      }
    >
      <Grid>
        {Asset.Statistics.resolveStatus(statistics.monitoringPointNum, statistics.alarmNum)
          .map((s) => ({ ...s, name: intl.get(s.name) }))
          .map(({ name, value }) => (
            <Col key={name} span={6}>
              <Statistic
                value={value}
                title={name}
                style={{ textAlign: 'center' }}
                valueStyle={{ fontSize: 18 }}
              />
            </Col>
          ))}
      </Grid>
    </Card>
  );
};
