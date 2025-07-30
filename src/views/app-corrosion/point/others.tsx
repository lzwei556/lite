import React from 'react';
import { Col, ColProps } from 'antd';
import intl from 'react-intl-universal';
import { NumberFormItem } from '../../../components';
import { MonitoringPointRow } from '../../asset-common';
import { AttributeFormItem } from './attributeFormItem';

type FieldProps = {
  formItemColProps: ColProps;
  monitoringPoint?: MonitoringPointRow;
  nameIndex?: number;
  restFields?: {
    fieldKey?: number | undefined;
  };
};

export const Others = ({ formItemColProps, monitoringPoint, ...props }: FieldProps) => {
  const initialThickness = (
    <AttributeFormItem label={intl.get('INITIAL_THICKNESS')} name='initial_thickness' {...props} />
  );
  const criticalThickness = (
    <AttributeFormItem
      label={intl.get('CRITICAL_THICKNESS')}
      name='critical_thickness'
      {...props}
    />
  );

  return (
    <>
      <Col {...formItemColProps}>{initialThickness}</Col>
      <Col {...formItemColProps}>{criticalThickness}</Col>
      <Col {...formItemColProps}>
        <ShortTerm {...props} />
      </Col>
      <Col {...formItemColProps}>
        <LongTerm {...props} />
      </Col>
    </>
  );
};

function ShortTerm(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'corrosion_rate_short_term'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...restFields}
      label='CORROSION_RATE_SHORT_TERM'
      name={nameProp}
      inputNumberProps={{ addonAfter: intl.get('UNIT_DAY') }}
    />
  );
}

function LongTerm(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'corrosion_rate_long_term'];
  const nameProp = nameIndex !== undefined ? [`${nameIndex}`, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...restFields}
      label='CORROSION_RATE_LONG_TERM'
      name={nameProp}
      inputNumberProps={{ addonAfter: intl.get('UNIT_DAY') }}
    />
  );
}
