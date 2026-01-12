import React from 'react';
import { CustmizableIntervalLayout, DateRangePickerProps } from '../custmizable-interval-layout';
import { Card, Grid } from 'components';
import { Col, Empty } from 'antd';

type Props = {
  loading: boolean;
  dateRangePickerProps: DateRangePickerProps;
  timestamps: number[];
  timestampsList: React.ReactElement;
  timestamp?: React.ReactElement;
};

export const TimestampsPickerLayout = ({
  timestamps,
  timestampsList,
  timestamp,
  ...rest
}: Props) => {
  return (
    <CustmizableIntervalLayout
      {...rest}
      content={
        timestamps.length === 0 ? (
          <Card>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Card>
        ) : (
          <Grid wrap={false}>
            <Col flex='300px'>{timestampsList}</Col>
            <Col flex='auto'>{timestamp}</Col>
          </Grid>
        )
      }
    />
  );
};
