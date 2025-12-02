import { Col, Space } from 'antd';
import { Card, DeleteIconButton, DownloadIconButton } from 'components';
import { CanAccess, Permission } from 'providers/access-control';
import React from 'react';
import {
  CustomizableIntervalProps,
  useDownloadProps,
  useProps
} from './use-customizable-interval-props';
import { HistoryDataFea } from 'features';
import { PropertyLightSelectFilter } from 'asset-common';
import { DownloadModal } from '../download-modal';
import { CustmizableIntervalLayout } from '../custmizable-interval-layout';

export const CustomizableInterval = (props: CustomizableIntervalProps) => {
  const {
    canOperateData,
    dateRangePickerProps,
    hasSelectedProperty,
    cardProps,
    chartProps,
    range,
    deleteButtonProps
  } = useProps(props);
  const { trigger, modal } = useDownloadProps({ ...props, range });

  return (
    <CustmizableIntervalLayout
      content={
        hasSelectedProperty && (
          <Col span={24}>
            <Card
              extra={
                <Space>
                  <PropertyLightSelectFilter {...cardProps.extra.propertySelectProps} />
                  {canOperateData && <DeleteIconButton {...deleteButtonProps} />}
                </Space>
              }
              title={cardProps.title}
            >
              <HistoryDataFea.PropertyChart {...chartProps} />
            </Card>
          </Col>
        )
      }
      dateRangePickerProps={dateRangePickerProps}
      extra={
        canOperateData && (
          <>
            <CanAccess {...Permission.MeasurementDataDownload}>
              <DownloadIconButton {...trigger.downloadIconButtonProps} />
            </CanAccess>
            {trigger.open && <DownloadModal {...modal} />}
          </>
        )
      }
    />
  );
};
