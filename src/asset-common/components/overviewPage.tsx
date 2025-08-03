import * as React from 'react';
import { Col } from 'antd';
import { Grid, Card, Chart } from '../../components';
import { generateColProps } from '../../utils/grid';

type ChartOptions = {
  title?: string;
  colProps: {
    xs: { span: number };
    sm: { span: number };
    md: { span: number };
    xl: { span: number };
    xxl: { span: number };
  };
  options?: any;
  render?: JSX.Element;
};
export type Overview = {
  statistics?: JSX.Element;
  charts?: ChartOptions[];
  introductions?: JSX.Element[];
  tabs?: JSX.Element;
  children?: React.ReactNode;
};
export const OverviewPage: React.FC<Overview> = (props) => {
  const { charts, statistics, introductions, tabs } = props;
  const colProps2 = generateColProps({ md: 12, lg: 12, xl: 8, xxl: 6 });

  const renderChart = ({ options, title, render }: ChartOptions) => {
    if (render) return render;
    return (
      <Card
        styles={{
          header: { position: 'absolute', top: 6, border: 0, width: '100%', textAlign: 'center' },
          body: { border: 0 }
        }}
        title={title || ''}
      >
        <Chart options={options} />
      </Card>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--body-bg-color)' }}>
      {statistics}
      <Grid>
        {charts && (
          <Col span={24}>
            <Grid gutter={0}>
              {charts.map((chart, index) => {
                return (
                  <React.Fragment key={index}>
                    <Col {...chart.colProps}>{renderChart(chart)}</Col>
                  </React.Fragment>
                );
              })}
            </Grid>
          </Col>
        )}
        {introductions && (
          <Col span={24}>
            <Grid>
              {introductions.map((i, index) => (
                <Col {...colProps2} key={index}>
                  {i}
                </Col>
              ))}
            </Grid>
          </Col>
        )}
        {tabs && <Col span={24}>{tabs}</Col>}
        {props.children && <Col span={24}>{props.children}</Col>}
      </Grid>
    </div>
  );
};
