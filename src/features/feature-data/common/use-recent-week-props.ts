import { GlobalStyles, useGlobalStyles } from 'styles';
import { generateColProps } from 'utils/grid';
import { CollapseProps, ColProps } from 'antd';
import { FeatureDataDTO } from '../types';
import { Feature, FeatureProperty } from 'domain/feature-property';

export type RecentWeekProps = {
  properties: Feature.Property[];
  data: FeatureDataDTO;
  getAlarm?: (property: Feature.Property) => any;
  colProps?: ColProps;
};

export const useGroupedPropertyChartsGridCollapseProps = (properties: Feature.Property[]) => {
  const styles = useGlobalStyles();
  const groups = FeatureProperty.getGrouped(properties);
  return {
    collapseProps: {
      bordered: false,
      defaultActiveKey: groups[0][0],
      expandIconPosition: 'end',
      style: { borderRadius: 0, backgroundColor: styles.colorBgContainerStyle.backgroundColor }
    } as CollapseProps,
    groups
  };
};

export const useGridItemsProps = (params: RecentWeekProps & { colProps?: ColProps }) => {
  const styles = useGlobalStyles();
  return params.properties.map((property) => {
    const chartCardProps = getPropertyChartCardProps({ ...params, property, styles });
    return { colProps: params.colProps, chartCardProps };
  });
};

const getPropertyChartCardProps = (
  params: RecentWeekProps & { property: Feature.Property } & {
    styles: GlobalStyles;
  }
) => {
  const { styles, getAlarm, ...rest } = params;
  return {
    ...rest,
    alarm: getAlarm?.(params.property),
    cardProps: styles.propertyHistoryCardStyle
  };
};

export const getColProps = (total?: number) => {
  if (total && total === 1) {
    return generateColProps({});
  } else {
    return generateColProps({ lg: 12, xl: 12, xxl: 12 });
  }
};
