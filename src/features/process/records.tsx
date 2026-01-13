import { Button, Col, Popover, Space } from 'antd';
import {
  Card,
  Descriptions,
  Flex,
  Grid,
  RangeDatePicker,
  Table,
  transformPagedresult,
  useRange
} from 'components';
import React from 'react';
import {
  DataType,
  fillReasonOptions,
  FillRecord,
  fillResultOptions,
  Reason,
  useFillRecords
} from './use-services';
import { MonitoringPointRow } from 'monitoring-point';
import intl from 'react-intl-universal';
import { Dayjs, getDisplayName, getOptionLabelByValue, getValue, roundValue } from 'utils';
import { autoFillParameter, ProcessType, ProcessTypeKey } from 'process-type';
import { Language, useLocaleContext } from 'localeProvider';
import { sourceIdField } from './common';
import { FaultType } from 'common';

type ReasonDetail = { label: string; children: string | number };

export const FillRecords = ({ id, assetId }: MonitoringPointRow) => {
  const [type, setType] = React.useState(`${DataType.Characteristic}`);
  const { numberedRange, setRange } = useRange();
  const [from, to] = numberedRange;
  const [page, setPage] = React.useState<{ size: number; page: number }>({ page: 1, size: 10 });
  const { data, runAsync: fetch } = useFillRecords([id, { from, to, ...page }]);
  const { paged, ds } = transformPagedresult(data);

  const monitoringPoints = ProcessType.useDataSources(assetId, ProcessTypeKey.AutoFill);

  React.useEffect(() => {
    fetch(id, { from, to, ...page });
  }, [id, fetch, from, to, page]);

  const getColumns = (lang: Language) => {
    const dataSourceId = {
      key: 'dataSourceId',
      dataIndex: 'dataSourceId',
      title: intl.get(sourceIdField.label),
      render: (id: number) => monitoringPoints.find((m) => m.id === id)?.name
    };
    const capacity = {
      key: 'capacity',
      dataIndex: 'capacity',
      title: getDisplayName({
        name: intl.get(autoFillParameter.fillingCapacity.label),
        lang,
        suffix: autoFillParameter.fillingCapacity.unit
      })
    };
    const reason = {
      key: 'reasons',
      dataIndex: 'reasons',
      title: intl.get('fill.reason'),
      render: (_: string, row: FillRecord) => <ReasonsCell record={row} />
    };
    const result = {
      key: 'result',
      dataIndex: 'result',
      title: intl.get('fill.result'),
      render: (result: number) => intl.get(getOptionLabelByValue(fillResultOptions, result))
    };
    const timestamp = {
      key: 'timestamp',
      dataIndex: 'timestamp',
      title: intl.get('TIMESTAMP'),
      render: (timestamp: number) => Dayjs.format(timestamp)
    };
    return [dataSourceId, capacity, reason, result, timestamp];
  };

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>
        {/* <Card
          activeTabKey={type}
          onTabChange={setType}
          tabList={dataTypeOptions.map(({ label, value }) => ({
            key: `${value}`,
            label: intl.get(label),
            children: (
              <Table
                columns={getColumns()}
                dataSource={ds}
                pagination={{ ...paged, onChange: (page, size) => setPage({ page, size }) }}
                // rowKey={}
              />
            )
          }))}
        /> */}
        <Table
          columns={getColumns(useLocaleContext().language)}
          dataSource={ds}
          pagination={{ ...paged, onChange: (page, size) => setPage({ page, size }) }}
          // rowKey={}
        />
      </Col>
    </Grid>
  );
};

const ReasonsCell = ({ record }: { record: FillRecord }) => {
  const reasons = getReasons(record);
  if (reasons.length > 2) {
    return (
      <Space>
        <span>
          {reasons
            .filter((_, i) => i < 2)
            .map((r) => `${r.label} ${r.children}`)
            .join(', ')}
          ...
        </span>
        <Button style={{ paddingInline: 0 }} type='link'>
          <Popover
            content={<Descriptions items={reasons} />}
            styles={{ body: { width: '25em' } }}
            title={intl.get('fill.reason')}
            trigger={['click']}
          >
            {intl.get('CLICK_TO_VIEW')}
          </Popover>
        </Button>
      </Space>
    );
  } else {
    return reasons.map((r) => `${r.label} ${r.children}`).join(', ');
  }
};

const getReasons = (record: FillRecord): ReasonDetail[] => {
  const { diagnosisResults, dataType } = record;
  const reasons: ReasonDetail[] = [];
  if (dataType === 0) {
    reasons.push(...record.reasons.map((reason) => getFailureReasonOfFeatureData(reason, record)));
  } else if (dataType === 1 && diagnosisResults && diagnosisResults.items.length > 0) {
    reasons.push(
      ...diagnosisResults.items.map((item) => item.diagnosis).map(getFailureReasonOfFault)
    );
  }
  return reasons;
};

const getFailureReasonOfFeatureData = (reason: number, row: FillRecord): ReasonDetail => {
  const {
    soundPressureLevel,
    energyRatio,
    stationarity,
    velocityX,
    velocityY,
    velocityZ,
    temperature
  } = row;
  const label = intl.get(getOptionLabelByValue(fillReasonOptions, reason));
  switch (reason) {
    case Reason.Temperatue:
      return { label, children: getValue({ value: temperature, unit: '℃' }) };
    case Reason.soundPressureLevel:
      return { label, children: roundValue(soundPressureLevel) };
    case Reason.energyRatio:
      return { label, children: roundValue(energyRatio) };
    case Reason.stationarity:
      return { label, children: roundValue(stationarity) };
    case Reason.velocityX:
      return { label, children: getValue({ value: velocityX, unit: 'mm/s' }) };
    case Reason.velocityY:
      return { label, children: getValue({ value: velocityY, unit: 'mm/s' }) };
    case Reason.velocityZ:
      return { label, children: getValue({ value: velocityZ, unit: 'mm/s' }) };
    default:
      return { label: intl.get('DEVICE_TYPE_UNKNOWN'), children: -1 };
  }
};

const getFailureReasonOfFault = (reason: number): ReasonDetail => {
  return { label: intl.get(getOptionLabelByValue(FaultType.options, reason)), children: '' };
};
