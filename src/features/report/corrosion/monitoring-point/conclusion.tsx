import React from 'react';
import intl from 'react-intl-universal';
import { ReportMonitoringPoint } from '../../types';
import { getMonitoringPointEvalLevel, MonitoringPointEvalLevel } from './common';
import { formatNames } from '../../utils';

const TOPIC = '测点';
const UNIT = '处';
const DISCOVER = '发现';
const TERM = {
  NoErrors: `所有${TOPIC}均处于正常状态`,
  OnlySingleReason: `${DISCOVER}`,
  MultipleReasons: {
    First: `${DISCOVER}有风险${TOPIC}`,
    Second: `其中`
  }
} as const;

const SUGGESTION = {
  Critical: '建议优先对其采取措施',
  Major: '建议对其加强跟踪',
  Minor: '建议对其密切关注'
} as const;

export const MonitoringPointConclusion = ({
  monitoringPoints
}: {
  monitoringPoints: ReportMonitoringPoint[];
}) => {
  const errors = monitoringPoints.filter(
    (m) => m.evaluationLevel !== MonitoringPointEvalLevel.Normal
  );
  const levels = getLevels(errors);
  if (errors.length === 0) {
    return <li>{TERM.NoErrors}</li>;
  } else if (errors.length === 1 || levels.length === 1) {
    const level = levels[0];
    return (
      <li>
        {TERM.OnlySingleReason}
        <Description errors={errors} level={level} />
      </li>
    );
  } else {
    return (
      <li>
        {TERM.MultipleReasons.First} <span className='value'>{errors.length}</span> {UNIT}，
        {TERM.MultipleReasons.Second}
        {levels
          .sort((l1, l2) => l2 - l1)
          .map((level, i) => {
            const filters = errors.filter((m) => m.evaluationLevel === level);
            return (
              <>
                <Description errors={filters} level={level} />
                {i !== levels.length - 1 ? '；' : ''}
              </>
            );
          })}
      </li>
    );
  }
};

const getLevels = (errors: ReportMonitoringPoint[]) => {
  const levels: number[] = [];
  errors.forEach((m) => levels.push(m.evaluationLevel));
  return Array.from(new Set(levels));
};

const Description = ({
  errors,
  level
}: {
  errors: ReportMonitoringPoint[];
  level: MonitoringPointEvalLevel;
}) => {
  const levelLabel = intl.get(getMonitoringPointEvalLevel(level));

  return (
    <>
      {levelLabel}
      {TOPIC} <span className='value'>{errors.length}</span> {UNIT}
      {formatNames(errors.map((d) => d.name))}，<Suggestion level={level} />
    </>
  );
};

const Suggestion = ({ level }: { level: MonitoringPointEvalLevel }) => {
  switch (level) {
    case MonitoringPointEvalLevel.Critical:
      return SUGGESTION.Critical;
    case MonitoringPointEvalLevel.Major:
      return SUGGESTION.Major;
    case MonitoringPointEvalLevel.Minor:
      return SUGGESTION.Minor;
  }
};
