import React from 'react';
import { Col, Empty, Space, Spin } from 'antd';
import { ChartMark, Card, Flex, Grid, useRange, RangeDatePicker } from 'components';
import { Dayjs } from 'utils';
import { AssetRow, TrendData } from 'asset-common';
import { useTrendData } from './useTrend';
import { AnalysisTabs } from './analysis-tabs';
import { Trend } from './trend';
import { SidebarProvider } from './mark/sidebar';
import { AxisSelect, PropertiesSelect, useAxisFilters, usePropertiesFilters } from './filters';
import { useAnalysisDataProps, useAnalysisTabsProps } from './useProps';
import { TMonitoringPoint } from 'domain/monitoring-point';

type Props = { id: number; attributes: TMonitoringPoint.Base['attributes']; asset: AssetRow };

export const VibrationAnalysis = (props: Props) => {
  const { numberedRange, setRange } = useRange();
  const { loading, data } = useTrendData(props.id, numberedRange);

  const renderSpinContent = () => {
    if (!data || data.length === 0) {
      return (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    } else {
      return <Content {...{ ...props, data }} />;
    }
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
        <Spin spinning={loading}>{renderSpinContent()}</Spin>
      </Col>
    </Grid>
  );
};

const Content = ({
  asset,
  id,
  data,
  attributes
}: Props & {
  data: TrendData[];
}) => {
  const [selected, setSelected] = React.useState<number | undefined>(
    data.find((d) => !!d.selected)?.timestamp
  );
  const chartProps = ChartMark.useAxisMarkLineStyleProps();
  const { isAnalysisOnlyAcceleration, ...tabsProps } = useAnalysisTabsProps();
  const propertyFilters = usePropertiesFilters(isAnalysisOnlyAcceleration);
  const axisFilters = useAxisFilters(attributes);
  const filters = { property: propertyFilters.property, axis: axisFilters.axis };
  const analysisData = useAnalysisDataProps({ id, timestamp: selected!, ...filters });
  const { replaceTimestamp } = analysisData.timeDomains;

  return (
    <Grid>
      <Col span={24}>
        <ChartMark.Context
          initial={
            selected
              ? [Dayjs.format(selected)].map((line) => ({
                  name: line,
                  type: 'Peak',
                  data: line,
                  chartProps
                }))
              : []
          }
        >
          <Trend
            id={id}
            attributes={attributes}
            data={data}
            onClick={(t) => {
              setSelected(t);
              replaceTimestamp(selected!, t);
            }}
          />
        </ChartMark.Context>
      </Col>
      {selected && (
        <Col span={24}>
          <SidebarProvider>
            <AnalysisTabs
              {...tabsProps}
              extra={
                <Space>
                  {!isAnalysisOnlyAcceleration && <PropertiesSelect {...propertyFilters} />}
                  {tabsProps.activeKey !== 'cross' && <AxisSelect {...axisFilters} />}
                </Space>
              }
              axisSelect={<AxisSelect {...axisFilters} />}
              monitoringPoint={{
                id,
                attributes,
                parent: asset
              }}
              trend={{ timestamp: selected, timestamps: data.map(({ timestamp }) => timestamp) }}
              filters={filters}
              intermediateData={analysisData}
            />
          </SidebarProvider>
        </Col>
      )}
    </Grid>
  );
};
