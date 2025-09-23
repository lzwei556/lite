import React from 'react';
import intl from 'react-intl-universal';
import { getKeyByValue } from '../../../utils';
import { DeviceEvalLevel, DeviceEvalReason } from '../constants';
import { ReportDevice } from '../types';
import { formatNames } from '../utils';

export const DeviceConclusion = ({ devices }: { devices: ReportDevice[] }) => {
  const errors = devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error);
  const reasons = getReasons(errors);
  if (errors.length === 0) {
    return <li>所有设备均处于正常状态</li>;
  } else if (errors.length === 1 || reasons.length === 1) {
    const reason = reasons[0];
    return (
      <li>
        发现 <Description errors={errors} reason={reason} />
      </li>
    );
  } else {
    return (
      <li>
        发现异常设备 <span className='value'>{errors.length}</span> 台，其中{' '}
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

const Description = ({ errors, reason }: { errors: ReportDevice[]; reason: DeviceEvalReason }) => {
  const reasonLabel = intl.get(getReasonLabel(reason));
  const suggestion = getSuggestion(reason);

  return (
    <>
      <span className='value'>{errors.length}</span> 台设备{formatNames(errors.map((d) => d.name))}
      {reasonLabel}，{suggestion}
    </>
  );
};

const getReasonLabel = (reason: DeviceEvalReason) => {
  switch (reason) {
    case DeviceEvalReason.Offline:
      return getKeyByValue(DeviceEvalReason, reason, 'device.eval.reason');
    case DeviceEvalReason.LowBattery:
      return getKeyByValue(DeviceEvalReason, reason, 'device.eval.reason');
    default:
      return 'device.eval.reason.signal.bad';
  }
};

const getSuggestion = (reason: DeviceEvalReason) => {
  switch (reason) {
    case DeviceEvalReason.Offline:
      return '建议提高现场设备维护频率';
    case DeviceEvalReason.LowBattery:
      return '建议及时更换电池';
    default:
      return '建议检查耦合情况';
  }
};
