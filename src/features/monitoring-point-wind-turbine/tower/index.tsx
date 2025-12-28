import React from 'react';
import { Col, ColProps } from 'antd';
import { InstallAngletItem } from './installAngleItem';
import { RadiusItem } from './tower-base-settlement/radiusItem';
import { InstallHeightItem } from './tower-inclination/installHeightItem';
import { MonitoringPointType } from 'common';

export const Index = (props: {
  type: number;
  formItemColProps: ColProps;
  nameIndex?: number;
  fieldKey?: number | undefined;
}) => {
  const { formItemColProps, type, ...rest } = props;

  return (
    <>
      <Col {...formItemColProps}>
        <InstallAngletItem {...rest} />
      </Col>
      <Col {...formItemColProps}>
        {type === MonitoringPointType.Value.TopInclination ? (
          <InstallHeightItem {...rest} />
        ) : (
          <RadiusItem {...rest} />
        )}
      </Col>
    </>
  );
};
