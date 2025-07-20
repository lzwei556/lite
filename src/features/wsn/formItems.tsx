import React from 'react';
import { Col, ColProps, FormInstance, InputNumber, Select } from 'antd';
import intl from 'react-intl-universal';
import { Grid, SelectFormItem, Term, TextFormItem } from '../../components';
import { Field } from '../../types';
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
  } else if (mode === ProvisioningMode.TimeDivision) {
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
}: Field<WSN> & {
  options: { label: string; value: number }[];
}) => {
  const formItemProps = useCommunicationPeriod(name, options);
  return (
    <SelectFormItem
      {...{
        label: <Term {...{ name: intl.get(label), description: intl.get(description) }} />,
        ...formItemProps
      }}
    />
  );
};

const MajorCommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    {...{
      name: 'communicationPeriod',
      label: 'major.communication.period',
      description: 'major.communication.period.desc',
      options: getCommunicationPeriodOptions(ProvisioningMode.TimeDivision)
    }}
  />
);

const SecondaryCommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    {...{
      name: 'communicationPeriod2',
      label: 'communication.period.2',
      description: 'communication.period.2.desc',
      options: SecondaryCommunicationPeriodOptions
    }}
  />
);

const CommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    {...{
      name: 'communicationPeriod',
      label: 'communication.period',
      description: 'communication.period.desc',
      options: getCommunicationPeriodOptions()
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
