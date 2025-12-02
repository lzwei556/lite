import { Space } from 'antd';
import { Card, ContentTopBottomLayout, Flex, RangeDatePicker } from 'components';
import React from 'react';
import { Dayjs } from 'utils';

export const CustmizableIntervalLayout = ({
  content,
  dateRangePickerProps,
  extra,
  loading
}: {
  content: React.ReactNode;
  dateRangePickerProps: {
    defaultValue: Dayjs.RangeValue;
    onChange: (range: Dayjs.RangeValue) => void;
  };
  extra?: React.ReactNode;
  loading?: boolean;
}) => {
  return (
    <ContentTopBottomLayout
      content={content}
      header={
        <Card>
          <Flex>
            <Space>
              <RangeDatePicker {...dateRangePickerProps} />
              {extra}
            </Space>
          </Flex>
        </Card>
      }
      loading={loading}
    />
  );
};
