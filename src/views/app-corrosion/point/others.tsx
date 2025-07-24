import React from 'react';
import { Col, ColProps, InputNumber } from 'antd';
import intl from 'react-intl-universal';
import { FormInputItem } from '../../../components/formInputItem';
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
    <FormInputItem
      {...restFields}
      initialValue={30}
      label={intl.get('CORROSION_RATE_SHORT_TERM')}
      name={nameProp}
      numericChildren={
        <InputNumber
          addonAfter={intl.get('UNIT_DAY')}
          controls={false}
          placeholder={intl.get('PLEASE_ENTER_SOMETHING', {
            something: intl.get('CORROSION_RATE_SHORT_TERM')
          })}
          style={{ width: '100%' }}
        />
      }
      numericRule={{
        isInteger: true,
        min: 1,
        message: intl.get('UNSIGNED_INTEGER_ENTER_PROMPT')
      }}
    />
  );
}

function LongTerm(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, restFields } = props;
  const commonNameProp = ['attributes', 'corrosion_rate_long_term'];
  const nameProp = nameIndex !== undefined ? [`${nameIndex}`, ...commonNameProp] : commonNameProp;

  return (
    <FormInputItem
      {...restFields}
      initialValue={365}
      label={intl.get('CORROSION_RATE_LONG_TERM')}
      name={nameProp}
      numericChildren={
        <InputNumber
          addonAfter={intl.get('UNIT_DAY')}
          controls={false}
          placeholder={intl.get('PLEASE_ENTER_SOMETHING', {
            something: intl.get('CORROSION_RATE_LONG_TERM')
          })}
          style={{ width: '100%' }}
        />
      }
      numericRule={{
        isInteger: true,
        min: 1,
        message: intl.get('UNSIGNED_INTEGER_ENTER_PROMPT')
      }}
    />
  );
}
