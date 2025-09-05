import React from 'react';
import { Table } from '../../components';

export type ReportTableProps = {
  columns: any;
  dataSource: any;
  showHeader: boolean;
};

export const ReportTable = ({ columns, dataSource, showHeader }: ReportTableProps) => {
  return (
    <Table
      bordered={true}
      cardProps={{ styles: { body: { padding: 0 } } }}
      columns={columns}
      dataSource={dataSource}
      noScroll={true}
      pagination={false}
      showHeader={showHeader}
      tableLayout='fixed'
    />
  );
};
