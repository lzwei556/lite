import { FormInstance } from 'antd';
import { getPropertiesByMonitoringPonitType, Rule } from 'domains/alarm-rule';
import * as Feature from 'domains/feature-property';
import { useAppConfig } from 'providers/app';
import React from 'react';
import * as MonitoringPoint from 'domains/monitoring-point';

export const useSelectMonitoringPointType = (
  form: FormInstance,
  setUnit: (unit?: string) => void
) => {
  const [properties, setProperties] = React.useState<Feature.Types.Property[]>([]);

  const onChange = React.useCallback(
    async (type: number) => {
      // 类型变更时清空所有规则的属性选择

      const rules: Rule[] = (form.getFieldValue('rules') ?? []).filter((r: Rule) => !!r.metric);
      if (rules.length) {
        form.resetFields(['rules']);
        setUnit(undefined);
      }

      // 获取并设置新属性列表
      const res = await getPropertiesByMonitoringPonitType({ type });
      const normalized = MonitoringPoint.Type.getProperties({
        type,
        properties: res
      });
      setProperties(normalized);
    },
    [form, setUnit]
  );

  return { properties, onChange, options: useAppConfig().monitoringPointTypeOptions };
};
