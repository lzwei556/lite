import React from 'react';
import { Col, Row, Statistic } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../utils/grid';
import { AssetRow } from '../types';
import { Asset } from '..';

export const StatisticBar = ({ asset }: { asset: AssetRow }) => {
  const getItems = () => {
    if (asset) {
      const { statistics } = asset;
      const descendant = Asset.Statistics.resolveDescendant(statistics).map((d) => ({
        ...d,
        name: intl.get(d.name)
      }));
      const status = Asset.Statistics.resolveStatus(
        statistics.monitoringPointNum,
        statistics.alarmNum
      ).map((s) => ({ ...s, name: intl.get(`leveled.alarm.${s.level}`) }));
      descendant.splice(1, 1, ...status.slice(1).reverse());
      return descendant;
    }
    return [];
  };

  return (
    <Row className='overview-statistic'>
      {getItems().map(({ name, value }, index) => (
        <Col key={index} {...generateColProps({ md: 12, lg: 12, xl: 4, xxl: 4 })}>
          <Statistic title={name} value={value} />
        </Col>
      ))}
    </Row>
  );
};
