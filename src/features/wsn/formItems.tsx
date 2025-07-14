import React from 'react';
import { Col, ColProps, Form, InputNumber, Select } from 'antd';
import intl from 'react-intl-universal';
import { Grid, Term } from '../../components';
import {
  CommunicationPeriodOptions,
  getInitialSettings,
  MajorCommunicationPeriodOptions,
  ProvisioningMode,
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
  setFieldsValue?: (values: any) => void;
};

export const FormItems = ({ formItemColProps, initial, setFieldsValue }: Props) => {
  const { mode, setMode } = useProvisioningMode(initial?.provisioning_mode);
  const onChangeProps = (mode: ProvisioningMode) => {
    setMode(mode);
    setFieldsValue?.({ wsn: getInitialSettings(mode, initial) });
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
          <ProvisioningModeFromItem onChange={setMode} />
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
  const { label, formItemProps, controlProps } = useProvisioningModeField(onChange);
  return (
    <Form.Item label={<Term {...label} />} {...formItemProps}>
      <Select {...controlProps} />
    </Form.Item>
  );
};

const GeneralCommunicationPeriod = ({
  label,
  name,
  options
}: {
  label: { name: string; description: string };
  name: string;
  options: { label: string; value: number }[];
}) => {
  const { formItemProps, contorlProps } = useCommunicationPeriod(name, options);
  return (
    <Form.Item
      label={<Term {...{ name: intl.get(label.name), description: intl.get(label.description) }} />}
      {...formItemProps}
    >
      <Select {...contorlProps} />
    </Form.Item>
  );
};

const MajorCommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    label={{ name: 'major.communication.period', description: 'major.communication.period.desc' }}
    name='communication_period'
    options={MajorCommunicationPeriodOptions}
  />
);

const SecondaryCommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    label={{
      name: 'secondary.communication.period',
      description: 'secondary.communication.period.desc'
    }}
    name='communication_period_2'
    options={SecondaryCommunicationPeriodOptions}
  />
);

const CommunicationPeriod = () => (
  <GeneralCommunicationPeriod
    label={{ name: 'communication.period', description: 'communication.period.desc' }}
    name='communication_period'
    options={CommunicationPeriodOptions}
  />
);

const CommunicationOffset = () => {
  const {
    formItemProps: { name }
  } = useCommunicationPeriod('communication_period');
  const { label, formItemProps, contorlProps } = useCommunicationOffset(name);
  return (
    <Form.Item label={<Term {...label} />} {...formItemProps}>
      <InputNumber {...contorlProps} />
    </Form.Item>
  );
};

const IntervalCnt = () => {
  const { label, formItemProps, contorlProps } = useIntervalCnt();
  return (
    <Form.Item label={<Term {...label} />} {...formItemProps}>
      <InputNumber {...contorlProps} />
    </Form.Item>
  );
};

const GroupSize = () => {
  const { label, formItemProps, contorlProps } = useGroupSize();
  return (
    <Form.Item label={<Term {...label} />} {...formItemProps}>
      <Select {...contorlProps} />
    </Form.Item>
  );
};

const GroupSize2 = () => {
  const { label, formItemProps, contorlProps } = useGroupSize2();
  return (
    <Form.Item label={<Term {...label} />} {...formItemProps}>
      <InputNumber {...contorlProps} />
    </Form.Item>
  );
};
