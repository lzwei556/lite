import { useMemo } from 'react';
import { useSimpleList } from 'resource';
import { AlarmRule, getList } from 'domains/alarm-rule';

export const useAlarmRuleList = (filters: { levels: number[]; monitoringPointType: number[] }) => {
  const list = useSimpleList(getList);

  const alarmRules = useMemo(
    () =>
      list.dataSource
        .filter(({ rules }) => rules.some((rule) => filters.levels.includes(rule.level)))
        .filter(({ type }) =>
          filters.monitoringPointType.length > 0 ? filters.monitoringPointType.includes(type) : true
        ),
    [list.dataSource, filters.levels, filters.monitoringPointType]
  );

  return {
    alarmRules,
    loading: list.loading,
    refresh: list.refresh
  };
};
