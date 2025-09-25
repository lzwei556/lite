import React from 'react';
import intl from 'react-intl-universal';
import { getMonitoringPointEvalLevel, MonitoringPointEvalLevel } from '../constants';
import { ReportMonitoringPoint } from '../types';
import { formatNames } from '../utils';

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
    return <li>所有测点均处于正常状态</li>;
  } else if (errors.length === 1 || levels.length === 1) {
    const level = levels[0];
    return (
      <li>
        发现
        <Description errors={errors} level={level} />
      </li>
    );
  } else {
    return (
      <li>
        发现有风险测点 <span className='value'>{errors.length}</span> 处，其中
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
  const suggestion = getSuggestion(level);

  return (
    <>
      {levelLabel}测点 <span className='value'>{errors.length}</span> 处
      {formatNames(errors.map((d) => d.name))}，{suggestion}
    </>
  );
};

const getSuggestion = (level: MonitoringPointEvalLevel) => {
  switch (level) {
    case MonitoringPointEvalLevel.Critical:
      return '建议优先对其采取措施';
    case MonitoringPointEvalLevel.Major:
      return '建议对其加强跟踪';
    case MonitoringPointEvalLevel.Minor:
      return '建议对其密切关注';
  }
};
