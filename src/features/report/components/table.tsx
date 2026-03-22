import React from 'react';
import { createStyles } from 'antd-style';
import { Table, TableProps } from 'antd';

export type ReportTableProps<T> = TableProps<T> & {
  showHeader: boolean;
};

const useStyles = createStyles(({ css }) => ({
  table: css`
    & .ant-table {
      line-height: 1.15;
      border-radius: 0px;
      .ant-table-container {
        table {
          border-radius: 0px;
        }
      }
      .ant-table-thead > tr > th {
        white-space: normal;
        background: transparent;
      }
    }
  `
}));

export const ReportTable = <T,>(props: ReportTableProps<T>) => {
  const { styles } = useStyles();
  return (
    <Table
      {...props}
      className={styles.table}
      pagination={false}
      size='small'
      tableLayout='fixed'
    />
  );
};
