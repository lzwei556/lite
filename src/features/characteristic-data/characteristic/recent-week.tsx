import { Col, Collapse, Empty, Spin } from 'antd';
import { Grid } from 'components';
import { HistoryDataFea } from 'features';
import React from 'react';
import intl from 'react-intl-universal';
import {
  RecentWeekProps,
  useGridItemsProps,
  useGroupedPropertyChartsGridCollapseProps
} from './use-recent-week-props';

type Props = RecentWeekProps & { loading: boolean; inclinationGridItem?: React.ReactNode };

export const RecentWeek = (props: Props) => {
  return (
    <Spin spinning={props.loading}>
      {props.data.length > 0 ? (
        <Charts {...props} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Spin>
  );
};

const Charts = (props: Props) => {
  const isGrouped = props.properties.every((p) => !!p.group);
  return isGrouped ? (
    <GroupedPropertyChartsGridCollapse {...props} />
  ) : (
    <Grid>
      {props.inclinationGridItem}
      <GridItems {...props} />
    </Grid>
  );
};

const GroupedPropertyChartsGridCollapse = (props: Props) => {
  const { collapseProps, groups } = useGroupedPropertyChartsGridCollapseProps(props.properties);

  return (
    <Collapse
      {...collapseProps}
      items={groups.map(([g, properties]) => ({
        key: g,
        label: intl.get(g),
        children: (
          <Grid>
            <GridItems {...{ ...props, properties }} group={g} />
          </Grid>
        )
      }))}
    />
  );
};

const GridItems = (props: Props & { group?: string }) => {
  return useGridItemsProps(props).map(({ colProps, chartCardProps }, index: number) => (
    <Col {...colProps} key={index}>
      <HistoryDataFea.PropertyChartCard {...chartCardProps} />
    </Col>
  ));
};
