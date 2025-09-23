import React from 'react';
import { createStyles } from 'antd-style';
import { Table } from '../../components';

export type ReportTableProps<T> = {
  columns: any;
  dataSource: T[];
  showHeader: boolean;
  style?: React.CSSProperties;
};

const useStyles = createStyles(({ token, css }) => ({
  table: css`
    & .ant-table {
      line-height: 1.15;
      .ant-table-thead > tr > th {
        white-space: normal;
      }
    }
  `
}));

export const ReportTable = <T,>(props: ReportTableProps<T>) => {
  const { styles } = useStyles();
  return (
    <Table
      {...props}
      bordered={true}
      cardProps={{ styles: { body: { padding: 0 } } }}
      className={styles.table}
      noScroll={true}
      pagination={false}
      tableLayout='fixed'
    />
  );
};
