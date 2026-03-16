import React from 'react';
import { Col, ColProps, FormInstance, InputNumber, Select } from 'antd';
import { Translation } from 'locales/utils';
import { Grid, SelectFormItem, Term, TextFormItem } from '../components';
import { Field } from '../types';
import {
  getCommunicationPeriodOptions,
  ProvisioningMode,
  resetInvalidCommunicationPeriod,
  SecondaryCommunicationPeriodOptions,
  useCommunicationOffset,
  useCommunicationPeriod,
  useGroupSize,
  useGroupSize2,
  useIntervalCnt,
  useProvisioningMode,
  useProvisioningModeField,
  WSN
} from './hooks';
import { PeriodOptionLabel } from 'locales/utils';

type Props = {
  formItemColProps: ColProps;
  initial?: WSN;
  form?: FormInstance;
};

export const FormItems = ({ formItemColProps, initial, form }: Props) => {
  const { mode, setMode } = useProvisioningMode(initial?.provisioningMode);
  const onChangeProps = (mode: ProvisioningMode) => {
    setMode(mode);
    form?.setFieldValue(
      'communicationPeriod',
      resetInvalidCommunicationPeriod(initial?.communicationPeriod, mode)
    );
  };
  if (mode === ProvisioningMode.Group) {
    return <GroupModeFormItems onChange={onChangeProps} formItemColProps={formItemColProps} />;
  } else if (mode === ProvisioningMode['Time-Division']) {
    return (
      <TimeDivisionModeFormItems onChange={onChangeProps} formItemColProps={formItemColProps} />
    );
  } else {
    return (
      <Grid>
        <Col {...formItemColProps}>
          <ProvisioningModeFromItem onChange={onChangeProps} />
        </Col>
        <Col {...formItemColProps}>
          <CommunicationPeriod />
        </Col>
        <Col {...formItemColProps}>
          <CommunicationOffset />
        </Col>
      </Grid>
    );
  }
};

type OnChange = { onChange: (mode: ProvisioningMode) => void };

const GroupModeFormItems = (props: Pick<Props, 'formItemColProps'> & OnChange) => {
  const { formItemColProps, onChange } = props;
  return (
    <Grid>
      <Col {...formItemColProps}>
        <ProvisioningModeFromItem onChange={onChange} />
      </Col>
      <Col {...formItemColProps}>
        <CommunicationPeriod />
      </Col>
      <Col {...formItemColProps}>
        <CommunicationOffset />
      </Col>
      <Col {...formItemColProps}>
        <GroupSize />
      </Col>
    </Grid>
  );
};

const TimeDivisionModeFormItems = (props: Pick<Props, 'formItemColProps'> & OnChange) => {
  const { formItemColProps, onChange } = props;
  return (
    <Grid>
      <Col {...formItemColProps}>
        <ProvisioningModeFromItem onChange={onChange} />
      </Col>
      <Col {...formItemColProps}>
        <MajorCommunicationPeriod />
      </Col>
      <Col {...formItemColProps}>
        <SecondaryCommunicationPeriod />
      </Col>
      <Col {...formItemColProps}>
        <IntervalCnt />
      </Col>
      <Col {...formItemColProps}>
        <CommunicationOffset />
      </Col>
      <Col {...formItemColProps}>
        <GroupSize2 />
      </Col>
    </Grid>
  );
};

const ProvisioningModeFromItem = ({ onChange }: OnChange) => {
  const { termProps, formItemProps, controlProps } = useProvisioningModeField(onChange);
  return (
    <TextFormItem label={<Term {...termProps} />} {...formItemProps}>
      <Select {...controlProps} />
    </TextFormItem>
  );
};

const GeneralCommunicationPeriod = ({
  label,
  name,
  description,
  options
}: Omit<Field<WSN>, 'options'> & {
  options: { label: PeriodOptionLabel; value: number }[];
}) => {
  const formItemProps = useCommunicationPeriod(name, options);
  return (
    <SelectFormItem
      {...{
        label: (
          <Term {...{ name: Translation.get(label), description: Translation.get(description) }} />
        ),
        ...formItemProps
      }}
    />
  );
};

const MajorCommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    {...{
      name: 'communicationPeriod',
      label: 'wsn.communication.period.major',
      description: 'wsn.communication.period.major.desc',
      options: getCommunicationPeriodOptions(ProvisioningMode['Time-Division']),
      type: 'enum'
    }}
  />
);

const SecondaryCommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    {...{
      name: 'communicationPeriod2',
      label: 'wsn.communication.period.minor',
      description: 'wsn.communication.period.minor.desc',
      options: SecondaryCommunicationPeriodOptions,
      type: 'enum'
    }}
  />
);

const CommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    {...{
      name: 'communicationPeriod',
      label: 'wsn.communication.period',
      description: 'wsn.communication.period.desc',
      options: getCommunicationPeriodOptions(),
      type: 'enum'
    }}
  />
);

const CommunicationOffset = () => {
  const { termProps, formItemProps, contorlProps } = useCommunicationOffset('communicationPeriod');
  return (
    <TextFormItem {...formItemProps} label={<Term {...termProps} />}>
      <InputNumber {...contorlProps} />
    </TextFormItem>
  );
};

const IntervalCnt = () => {
  const { termProps, formItemProps, contorlProps } = useIntervalCnt();
  return (
    <TextFormItem label={<Term {...termProps} />} {...formItemProps}>
      <InputNumber {...contorlProps} />
    </TextFormItem>
  );
};

const GroupSize = () => {
  const { termProps, ...rest } = useGroupSize();
  return <SelectFormItem {...{ ...rest, label: <Term {...termProps} /> }} />;
};

const GroupSize2 = () => {
  const { termProps, formItemProps, contorlProps } = useGroupSize2();
  return (
    <TextFormItem label={<Term {...termProps} />} {...formItemProps}>
      <InputNumber {...contorlProps} />
    </TextFormItem>
  );
};
