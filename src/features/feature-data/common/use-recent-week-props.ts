import { GlobalStyles, useGlobalStyles } from 'styles';
import { generateColProps } from 'utils/grid';
import { CollapseProps, ColProps } from 'antd';
import { FeatureDataDTO } from '../types';
import * as Feature from 'domains/feature-property';

export type RecentWeekProps = {
  properties: Feature.Types.Property[];
  data: FeatureDataDTO;
  getAlarm?: (property: Feature.Types.Property) => any;
  colProps?: ColProps;
};

export const useGroupedPropertyChartsGridCollapseProps = (properties: Feature.Types.Property[]) => {
  const styles = useGlobalStyles();
  const groups = Feature.Property.getGrouped(properties);
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
  params: RecentWeekProps & { property: Feature.Types.Property } & {
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
