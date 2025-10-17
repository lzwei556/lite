import React from 'react';
import { ReportDevice } from '../../types';
import { DeviceEvalLevel, DeviceEvalReason } from './common';
import intl from 'react-intl-universal';
import { formatNames } from '../../utils';
import { getKeyByValue } from '../../../../utils';

const TOPIC = '设备';
const UNIT = '台';
const DISCOVER = '发现';
const TERM = {
  NoErrors: `所有${TOPIC}均处于正常状态`,
  OnlySingleReason: `${DISCOVER}`,
  MultipleReasons: {
    First: `${DISCOVER}异常${TOPIC}`,
    Second: `其中 `
  }
} as const;

const SUGGESTION = {
  Offline: '建议提高现场设备维护频率',
  LowBattery: '建议及时更换电池',
  LowSingal: '建议检查耦合情况'
} as const;

export const DevicesConclusion = ({ devices }: { devices: ReportDevice[] }) => {
  const errors = devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error);
  const reasons = getReasons(errors);
  if (errors.length === 0) {
    return <li>{TERM.NoErrors}</li>;
  } else if (errors.length === 1 || reasons.length === 1) {
    const reason = reasons[0];
    return (
      <li>
        {TERM.OnlySingleReason} <Description errors={errors} reason={reason} />
      </li>
    );
  } else {
    return (
      <li>
        {TERM.MultipleReasons.First} <span className='value'>{errors.length}</span> {UNIT}，
        {TERM.MultipleReasons.Second}
        {reasons.map((reason, i) => {
          const filters = errors.filter((d) => (d.evaluationReasons ?? []).includes(reason));
          return (
            <>
              <Description errors={filters} reason={reason} />
              {i !== reasons.length - 1 ? '；' : ''}
            </>
          );
        })}
      </li>
    );
  }
};

const getReasons = (errors: ReportDevice[]) => {
  const reasons: number[] = [];
  errors.forEach((d) => reasons.push(...(d.evaluationReasons ?? [])));
  return Array.from(new Set(reasons));
};

//eg. 15 台设备（Cold testing-LoRa、DC210-L、DC110-L等）离线，建议提高现场设备维护频率
const Description = ({ errors, reason }: { errors: ReportDevice[]; reason: DeviceEvalReason }) => {
  return (
    <>
      <span className='value'>{errors.length}</span> {UNIT}{TOPIC}
      {formatNames(errors.map((d) => d.name))}
      <ReasonLabel reason={reason} />，<Suggestion reason={reason} />
    </>
  );
};

const ReasonLabel = ({ reason }: { reason: DeviceEvalReason }) => {
  let label = '';
  switch (reason) {
    case DeviceEvalReason.Offline:
      label = getKeyByValue(DeviceEvalReason, reason, 'device.eval.reason');
      break;
    case DeviceEvalReason.LowBattery:
      label = getKeyByValue(DeviceEvalReason, reason, 'device.eval.reason');
      break;
    default:
      label = 'device.eval.reason.signal.bad';
      break;
  }
  return intl.get(label);
};

const Suggestion = ({ reason }: { reason: DeviceEvalReason }) => {
  switch (reason) {
    case DeviceEvalReason.Offline:
      return SUGGESTION.Offline;
    case DeviceEvalReason.LowBattery:
      return SUGGESTION.LowBattery;
    default:
      return SUGGESTION.LowSingal;
  }
};
