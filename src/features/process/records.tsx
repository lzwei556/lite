import { Col } from 'antd';
import {
  Card,
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
  diagnosisResultOptions,
  fillReasonOptions,
  FillRecord,
  fillResultOptions,
  useFillRecords
} from './use-services';
import { MonitoringPointRow } from 'monitoring-point';
import intl from 'react-intl-universal';
import { Dayjs, getDisplayName, getOptionLabelByValue } from 'utils';
import { autoFillParameter, ProcessType, ProcessTypeKey } from 'process-type';
import { Language, useLocaleContext } from 'localeProvider';
import { sourceIdField } from './common';

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
      key: 'reason',
      dataIndex: 'reason',
      title: intl.get('fill.reason'),
      render: (reasons: number[], row: FillRecord) => {
        const { dataType, diagnosisResults } = row;
        if (dataType === 0) {
          return reasons.length > 2
            ? reasons
                .filter((_, index) => index < 2)
                .map((r) => intl.get(getOptionLabelByValue(fillReasonOptions, r)))
                .join()
            : intl.get(getOptionLabelByValue(fillReasonOptions, reasons[0]));
        } else if (diagnosisResults && diagnosisResults.items.length > 0) {
          return diagnosisResults.items
            .filter((_, index) => index < 2)
            .map((r) => intl.get(getOptionLabelByValue(diagnosisResultOptions, r.diagnosis)))
            .join();
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
