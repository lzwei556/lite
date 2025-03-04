import React from 'react';
import { Col, Radio } from 'antd';
import intl from 'react-intl-universal';
import { Grid, Tabs } from '../../../components';
import {
  AssetNavigator,
  AssetRow,
  MONITORING_POINT,
  MonitoringPointRow,
  MonitoringPointsTable,
  TabBarExtraLeftContent
} from '../../asset-common';
import { Update } from './update';
import { PointsTable } from './pointsTable';

export const Index = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { asset, onSuccess } = props;
  const { alertLevel, id } = asset;
  const [type, setType] = React.useState('basic');

  return (
    <Tabs
      items={[
        {
          key: 'monitoringPointList',
          label: intl.get('MONITORING_POINT_LIST'),
          children: <MonitoringPointsTable asset={asset} enableSettingColumnsCount={true} />
        },
        {
          key: 'settings',
          label: intl.get('SETTINGS'),
          children: (
            <Grid>
              <Col span={24}>
                <Radio.Group
                  options={[
                    { label: intl.get('BASIC_INFORMATION'), value: 'basic' },
                    { label: intl.get(MONITORING_POINT), value: 'monitoringPoints' }
                  ]}
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                  optionType='button'
                  buttonStyle='solid'
                />
              </Col>
              <Col span={24}>
                {type === 'basic' && <Update asset={asset} onSuccess={onSuccess} key={asset.id} />}
                {type === 'monitoringPoints' && <PointsTable {...props} />}
              </Col>
            </Grid>
          )
        }
      ]}
      tabBarExtraContent={{
        left: (
          <TabBarExtraLeftContent alertLevel={alertLevel}>
            <AssetNavigator id={id} type={asset.type} />
          </TabBarExtraLeftContent>
        )
      }}
      tabsRighted={true}
    />
  );
};
