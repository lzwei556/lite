import React from 'react';
import { Col, ColProps, Form, InputNumber, Select } from 'antd';
import intl from 'react-intl-universal';
import { Grid, Term } from '../../components';
import {
  CommunicationPeriodOptions,
  MajorCommunicationPeriodOptions,
  ProvisioningMode,
  SecondaryCommunicationPeriodOptions,
  useCommunicationOffset,
  useCommunicationPeriod,
  useGroupSize,
  useGroupSize2,
  useIntervalCnt,
  useProvisioningMode,
  useProvisioningModeField
} from './hooks';

type Props = {
  formItemColProps: ColProps;
  onChange: (mode: ProvisioningMode) => void;
};

export const FormItems = ({
  formItemColProps,
  mode: modeFromProps
}: Omit<Props, 'onChange'> & { mode?: ProvisioningMode }) => {
  const { mode, setMode } = useProvisioningMode(modeFromProps);
  if (mode === ProvisioningMode.Group) {
    return <GroupModeFormItems onChange={setMode} formItemColProps={formItemColProps} />;
  } else if (mode === ProvisioningMode.TimeDivision) {
    return <TimeDivisionModeFormItems onChange={setMode} formItemColProps={formItemColProps} />;
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

const GroupModeFormItems = (props: Props) => {
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

const TimeDivisionModeFormItems = (props: Props) => {
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

const ProvisioningModeFromItem = ({ onChange }: { onChange: (mode: ProvisioningMode) => void }) => {
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
