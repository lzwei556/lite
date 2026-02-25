import React from 'react';
import { Col, Spin } from 'antd';
import {
  AssetNavigator,
  AssetRow,
  ContextProps,
  MonitoringPointRow,
  MonitoringPointsTable,
  updateAsset
} from '../../asset-common';
import * as Point from '../monitoring-point-vibration';
import { AssetModelProvider } from '../../asset-model';
import { Grid, TabsDetail, TabsDetailsItems } from '../../components';
import intl from 'react-intl-universal';
import { Overview } from './overview';
import { Update } from './update';
import { PointsTable } from './pointsTable';
import { AssetAnnotationImage } from '../imageAnnotation';
import { Permission, useCan } from '../../providers/access-control';
import { ENV } from '../../utils';
import { OverviewLegacy } from './overview-legacy';
import { DiagnosisMarksFormAlert, FaultDiagnosisDetail } from 'features/vibration-fault-diagnosis';
import { useAssetDiagnosis } from 'features/vibration-fault-diagnosis/common';

export const Index = ({ loading, asset, refresh }: ContextProps & { asset: AssetRow }) => {
  const [open, setOpen] = React.useState(false);
  const [mointoringPoint, setMonitoringPoint] = React.useState<MonitoringPointRow | undefined>();
  const canEditMonitoringPoint = useCan(Permission.MeasurementEdit);
  const reset = () => {
    setOpen(false);
    setMonitoringPoint(undefined);
  };

  const useFeatures = () => {
    const props = {
      asset,
      onSuccess: refresh,
      onUpdate: (m: MonitoringPointRow) => {
        setOpen(true);
        setMonitoringPoint(m);
      }
    };

    const monitoringPoints = asset.monitoringPoints ?? [];
    const isLegacy = ENV.legacyEnabled === 'true';

    const { data: diagnosisResult } = useAssetDiagnosis(
      asset.id,
      !!asset.diagnosisIsEnabled,
      asset.diagnosisPeriod === 0
    );

    const items: TabsDetailsItems = [
      {
        key: 'overview',
        label: intl.get('OVERVIEW'),
        content: isLegacy ? (
          <OverviewLegacy asset={asset} onSuccess={refresh} key={asset.id} />
        ) : (
          <Overview asset={asset} onSuccess={refresh} key={asset.id} diagnosis={diagnosisResult} />
        )
      }
    ];
    if (shouldDisplayDiagnosis(asset)) {
      items.push({
        key: 'diagnosis',
        label: intl.get('common.diagnosis'),
        content: diagnosisResult && (
          <FaultDiagnosisDetail
            {...diagnosisResult}
            key={asset.id}
            monitoringPoints={monitoringPoints}
            rotationSpeed={asset.attributes?.rotation_speed}
          />
        )
      });
    }
    items.push(
      ...[
        {
          key: 'monitoringPointList',
          label: intl.get('MONITORING_POINT_LIST'),
          content: (
            <MonitoringPointsTable
              key={`${monitoringPoints.map(({ id }) => id).join()}`}
              asset={asset}
              enableSettingColumnsCount={true}
            />
          )
        },
        {
          key: 'settings',
          label: intl.get('SETTINGS'),
          content: (
            <Grid>
              <Col span={24}>
                <Update asset={asset} onSuccess={refresh} key={asset.id} />
              </Col>
              <Col span={24}>
                <PointsTable {...props} key={asset.id} />
              </Col>
              {!isLegacy && (
                <Col span={24}>
                  <AssetAnnotationImage
                    asset={asset}
                    key={`${asset.id}_${asset.monitoringPoints?.length}_${asset.image}`}
                    editable={canEditMonitoringPoint}
                    title={intl.get('OVERVIEW')}
                    onSuccess={refresh}
                  />
                </Col>
              )}
            </Grid>
          )
        }
      ]
    );
    return items;
  };

  return (
    <Spin spinning={loading}>
      {ENV.debug === 'true' && (
        <DiagnosisMarksFormAlert
          asset={asset}
          onSubmit={(faults) =>
            updateAsset(asset.id, {
              id: asset.id,
              name: asset.name,
              type: asset.type,
              parent_id: asset.parentId,
              marks: { faults }
            })
          }
        />
      )}
      <AssetModelProvider asset={asset}>
        <TabsDetail items={useFeatures()} title={<AssetNavigator asset={asset} />} />
      </AssetModelProvider>
      {mointoringPoint && (
        <Point.UpdateModal
          key={mointoringPoint.id}
          monitoringPoint={mointoringPoint}
          open={open}
          onCancel={reset}
          onSuccess={() => {
            refresh();
            reset();
          }}
        />
      )}
    </Spin>
  );
};

export const shouldDisplayDiagnosis = (asset: AssetRow) => {
  return asset.diagnosisIsEnabled && (asset.monitoringPoints ?? []).length !== 0;
};
