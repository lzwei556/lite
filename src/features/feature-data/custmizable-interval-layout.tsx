import { Space } from 'antd';
import { Card, ContentTopBottomLayout, Flex, RangeDatePicker } from 'components';
import React from 'react';
import { Dayjs } from 'utils';

export type DateRangePickerProps = {
  defaultValue: Dayjs.RangeValue;
  onChange: (range: Dayjs.RangeValue) => void;
};

export const CustmizableIntervalLayout = ({
  content,
  dateRangePickerProps,
  extra,
  loading,
  interactionDisabled = false
}: {
  content: React.ReactNode;
  dateRangePickerProps: DateRangePickerProps;
  extra?: React.ReactNode;
  loading?: boolean;
  interactionDisabled?: boolean;
}) => {
  return (
    <ContentTopBottomLayout
      content={content}
      header={
        !interactionDisabled && (
          <Card>
            <Flex>
              <Space>
                <RangeDatePicker {...dateRangePickerProps} />
                {extra}
              </Space>
            </Flex>
          </Card>
        )
      }
      loading={loading}
    />
  );
};
