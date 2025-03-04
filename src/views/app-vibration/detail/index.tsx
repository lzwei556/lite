import React from 'react';
import { Radio } from 'antd';
import intl from 'react-intl-universal';
import { Card } from '../../../components';
import { Tabs } from '../../../components';
import {
  AssetNavigator,
  AssetRow,
  MONITORING_POINT,
  MonitoringPointRow,
  MonitoringPointsTable,
  TabBarExtraLeftContent
} from '../../asset-common';
import { Index as Overview } from './overview';
import { Update } from './update';
import { PointsTable } from './pointsTable';

export const Index = (props: {
  asset: AssetRow;
  onSuccess: () => void;
  onUpdate: (m: MonitoringPointRow) => void;
}) => {
  const { asset, onSuccess } = props;
  const { id, alertLevel } = asset;
  const [type, setType] = React.useState('basic');

  return (
    <Tabs
      items={[
        {
          key: 'overview',
          label: intl.get('OVERVIEW'),
          children: <Overview asset={asset} />
        },
        {
          key: 'monitoringPointList',
          label: intl.get('MONITORING_POINT_LIST'),
          children: <MonitoringPointsTable asset={asset} enableSettingColumnsCount={true} />
        },
        {
          key: 'settings',
          label: intl.get('SETTINGS'),
          children: (
            <Card>
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
              {type === 'basic' && <Update asset={asset} onSuccess={onSuccess} key={asset.id} />}
              {type === 'monitoringPoints' && <PointsTable {...props} />}
            </Card>
          )
        }
      ]}
      noStyle={true}
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
