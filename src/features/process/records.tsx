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
  dataTypeOptions,
  DiagnosisResult,
  diagnosisResultOptions,
  fillReasonOptions,
  FillRecord,
  fillResultOptions,
  Reason,
  useFillRecords
} from './use-services';
import { MonitoringPointRow } from 'monitoring-point';
import intl from 'react-intl-universal';
import { Dayjs, getDisplayName, getOptionLabelByValue, getValue } from 'utils';
import { autoFillParameter, ProcessType, ProcessTypeKey } from 'process-type';
import { Language, useLocaleContext } from 'localeProvider';
import { sourceIdField } from './common';

export const FillRecords = ({ id, assetId }: MonitoringPointRow) => {
  const [type, setType] = React.useState(`${DataType.Feature}`);
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
      render: (reasons: number[], row: FillRecord) => {
        const { dataType, diagnosisResults } = row;
        if (dataType === 0) {
          return (
            <ReasonsCell
              reasons={reasons.map((r) => intl.get(getOptionLabelByValue(fillReasonOptions, r)))}
              row={row}
            />
          );
        } else if (diagnosisResults && diagnosisResults.items.length > 0) {
          return (
            <ReasonsCell
              reasons={diagnosisResults.items.map((r) =>
                intl.get(getOptionLabelByValue(diagnosisResultOptions, r.diagnosis))
              )}
            />
          );
        }
      }
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

const ReasonsCell = ({ reasons, row }: { reasons: string[]; row?: FillRecord }) => {
  if (reasons.length > 2) {
    return (
      <Space>
        <span>{reasons.filter((_, i) => i < 2)}...</span>
        <Button style={{ paddingInline: 0 }} type='link'>
          <Popover
            content={
              row && (
                <Descriptions
                  items={row.reasons.map((reason) => getReasonOption(reason, row))}
                  labelStyle={{ width: '10em' }}
                />
              )
            }
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
    return reasons.join();
  }
};

const getReasonOption = (reason: number, row: FillRecord) => {
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
      return { label, children: soundPressureLevel };
    case Reason.energyRatio:
      return { label, children: energyRatio };
    case Reason.stationarity:
      return { label, children: stationarity };
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
