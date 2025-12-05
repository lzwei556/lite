import React from 'react';
import { Col, ColProps } from 'antd';
import intl from 'react-intl-universal';
import { NumberFormItem, NumberFormItemWithSwitcher } from '../../components';
import {
  CorrosionRateLongTerm,
  CorrosionRateShortTerm,
  CriticalThickness,
  InitialThickness
} from '../../asset-common';

type FieldProps = {
  formItemColProps: ColProps;
  namePrefix?: string;
  nameIndex?: number;
  fieldKey?: number | undefined;
};

export const Others = ({ formItemColProps, namePrefix, ...props }: FieldProps) => {
  const { nameIndex } = props;
  const nameProp = nameIndex !== undefined ? [nameIndex, 'attributes'] : ['attributes'];
  return (
    <>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          {...props}
          label={InitialThickness.label}
          name={[...nameProp, InitialThickness.name]}
          namePrefix={namePrefix}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItemWithSwitcher
          {...props}
          label={CriticalThickness.label}
          name={[...nameProp, CriticalThickness.name]}
          namePrefix={namePrefix}
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
  const commonNameProp = ['attributes', CorrosionRateShortTerm.name];
  const nameProp = nameIndex !== undefined ? [nameIndex, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label={CorrosionRateShortTerm.label}
      name={nameProp}
      inputNumberProps={{ addonAfter: intl.get(CorrosionRateShortTerm.unit!) }}
    />
  );
}

function LongTerm(props: Omit<FieldProps, 'formItemColProps'>) {
  const { nameIndex, ...rest } = props;
  const commonNameProp = ['attributes', CorrosionRateLongTerm.name];
  const nameProp = nameIndex !== undefined ? [`${nameIndex}`, ...commonNameProp] : commonNameProp;

  return (
    <NumberFormItem
      {...rest}
      label={CorrosionRateLongTerm.label}
      name={nameProp}
      inputNumberProps={{ addonAfter: intl.get(CorrosionRateLongTerm.unit!) }}
    />
  );
}
