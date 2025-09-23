import React from 'react';
import { Spin } from 'antd';
import { AlarmRule } from '../features/alarm/alarm-group/types';
import { DisplayProperty } from '../constants/properties';
import { SeriesAlarm } from '../components';
import { getAlarmRules } from '../features/alarm/alarm-group/services';

const MonitorPointContext = React.createContext<{
  ruleGroups: AlarmRule[];
  refresh: () => void;
}>({ ruleGroups: [], refresh: () => {} });

export const MonitoringPointProvider = ({
  children,
  id
}: {
  children: React.ReactNode;
  id: number;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [ruleGroups, setRuleGroups] = React.useState<AlarmRule[]>([]);
  React.useEffect(() => {
    setLoading(true);
    getAlarmRules(id)
      .then(setRuleGroups)
      .finally(() => setLoading(false));
  }, [id]);

  const refresh = () => {
    getAlarmRules(id).then(setRuleGroups);
  };
  return (
    <MonitorPointContext.Provider value={{ ruleGroups, refresh }}>
      <Spin spinning={loading}>{children}</Spin>
    </MonitorPointContext.Provider>
  );
};

export const useMonitoringPointContext = () => React.useContext(MonitorPointContext);

export const getSeriesAlarm = (
  ruleGroups: AlarmRule[],
  property: DisplayProperty
): (Pick<SeriesAlarm, 'rules'> & { propertyKey: string }) | undefined => {
  const rules: SeriesAlarm['rules'] = [];
  ruleGroups.forEach((group) => {
    rules.push(
      ...group.rules
        .filter((rule) => {
          const metricKey = rule.metric.key;
          if (metricKey.indexOf('.')) {
            return (
              !!property.fields?.find((field) => field.key === metricKey.split('.')[1]) &&
              !rules.find((r) => r.level === rule.level)
            );
          }
          return false;
        })
        .map((rule) => {
          return {
            value: rule.threshold,
            condition: rule.operation as SeriesAlarm['rules'][number]['condition'],
            level: rule.level
          };
        })
    );
  });
  return rules.length > 0 ? { propertyKey: property.key, rules } : undefined;
};
