import { Col, ColProps, Space, Typography } from 'antd';
import { Data, Props, transform, useCardTitleProps, useChartProps } from './use-inclination-offset';
import { Card, CardProps, Chart, ChartProps } from 'components';
import intl from 'react-intl-universal';
import { useGlobalStyles } from 'styles';
import { MonitoringPointType } from 'common';
import { AssetRow } from 'asset-common';
import { useCustomizableIntervals } from '../../use-services';

export const InclinationGridItem = (props: Props & { colProps?: ColProps }) => {
  const { visible, chartCardProps } = useInclinationGridItemProps(props);
  return (
    visible && (
      <Col {...props.colProps}>
        <InclinationOffsetChartCard {...chartCardProps} />
      </Col>
    )
  );
};

const useInclinationGridItemProps = (params: Props) => {
  const visible = MonitoringPointType.Categories.getKeys(['inclination']).includes(params.type);
  const styles = useGlobalStyles();
  return {
    visible,
    chartCardProps: {
      monitoringPoints: [params],
      cardProps: styles.propertyHistoryCardStyle,
      chartProps: { style: { height: 240 } }
    }
  };
};

const InclinationOffsetChartCard = ({
  cardProps,
  chartProps,
  monitoringPoints
}: {
  cardProps?: CardProps;
  chartProps?: ChartProps;
  monitoringPoints: Props[];
}) => {
  const datas = transform(monitoringPoints);

  return (
    <Card title={<InclinationOffsetChartCardTitle datas={datas} />} {...cardProps}>
      <InclinationOffsetChart {...chartProps} datas={datas} />
    </Card>
  );
};

const InclinationOffsetChartCardTitle = ({ datas }: { datas: Data[] }) => {
  const props = useCardTitleProps(datas);
  if (Array.isArray(props)) {
    return props.map(({ value, style, label, displayValue }, i) => {
      return (
        value && (
          <Space key={i} style={style}>
            <Typography.Text type='secondary'>{intl.get(label)}</Typography.Text>
            {displayValue}
          </Space>
        )
      );
    });
  } else {
    return intl.get(props);
  }
};

const InclinationOffsetChart = (props: { datas: Data[] } & ChartProps) => {
  return <Chart {...useChartProps(props)} />;
};

export const InclinationOffsetsChart = ({ asset, ...rest }: { asset: AssetRow } & ChartProps) => {
  const { datas } = useCustomizableIntervals(asset.monitoringPoints ?? []);

  return <Chart {...useChartProps({ ...rest, datas: transform(datas) })} />;
};
