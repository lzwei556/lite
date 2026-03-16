import React from 'react';
import { Col, Statistic } from 'antd';
import { generateColProps } from '../../utils/grid';
import { Card, Grid } from '../../components';
import { AssetRow } from '../types';
import { Asset } from '..';
import { Translation } from 'locales/utils';
import { getLabelByValue } from 'features/alarm';

export const StatisticBar = ({ asset }: { asset: AssetRow }) => {
  const getItems = () => {
    if (asset) {
      const { statistics } = asset;
      const descendant = Asset.Statistics.resolveDescendant(statistics).map((d) => ({
        ...d,
        name: Translation.get(d.name)
      }));
      const status = Asset.Statistics.resolveStatus(
        statistics.monitoringPointNum,
        statistics.alarmNum
      ).map((s) => ({ ...s, name: Translation.leveledAlarm(getLabelByValue(s.level)) }));
      descendant.splice(1, 1, ...status.slice(1).reverse());
      return descendant;
    }
    return [];
  };

  return (
    <Card>
      <Grid>
        {getItems().map(({ name, value }, index) => (
          <Col key={index} {...generateColProps({ md: 12, lg: 12, xl: 4, xxl: 4 })}>
            <Statistic title={name} value={value} style={{ textAlign: 'center' }} />
          </Col>
        ))}
      </Grid>
    </Card>
  );
};
