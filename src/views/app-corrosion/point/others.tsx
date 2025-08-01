import React from 'react';
import { Col, ColProps } from 'antd';
import intl from 'react-intl-universal';
import { NumberFormItem, NumberFormItemWithSwitcher } from '../../../components';
import { MonitoringPointRow } from '../../asset-common';

type FieldProps = {
  monitoringPoint?: MonitoringPointRow;
  formItemColProps: ColProps;
  nameIndex?: number;
  fieldKey?: number | undefined;
};

export const Others = ({ monitoringPoint, formItemColProps, ...props }: FieldProps) => {
  const { nameIndex } = props;
  const nameProp = nameIndex !== undefined ? [`${nameIndex}`, 'attributes'] : ['attributes'];
  return (
    <>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={'INITIAL_THICKNESS'}
          name={[...nameProp, 'initial_thickness']}
          enabled={monitoringPoint?.attributes?.initial_thickness_enabled}
          enabledFormItemProps={props}
          numberFormItemProps={props}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          label={'CRITICAL_THICKNESS'}
          name={[...nameProp, 'critical_thickness']}
          enabled={monitoringPoint?.attributes?.critical_thickness_enabled}
          enabledFormItemProps={props}
          numberFormItemProps={props}
        />
      </Col>
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
  const { nameIndex, ...rest } = props;
  const commonNameProp = ['attributes', 'corrosion_rate_short_term'];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label='CORROSION_RATE_SHORT_TERM'
      name={nameProp}
      inputNumberProps={{ addonAfter: intl.get('UNIT_DAY') }}
    />
  );
}

function LongTerm(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, ...rest } = props;
  const commonNameProp = ['attributes', 'corrosion_rate_long_term'];
  const nameProp = nameIndex !== undefined ? [`${nameIndex}`, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label='CORROSION_RATE_LONG_TERM'
      name={nameProp}
      inputNumberProps={{ addonAfter: intl.get('UNIT_DAY') }}
    />
  );
}
