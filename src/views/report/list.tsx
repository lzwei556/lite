import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Segmented, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import intl from 'react-intl-universal';
import { Table, transformPagedresult, RangeDatePicker, useRange } from '../../components';
import { Store, useStore } from '../../hooks/store';
import { PageResult } from '../../types/page';
import request from '../../utils/request';
import { GetResponse } from '../../utils/response';
import { Dayjs, pickOptionsFromNumericEnum } from '../../utils';
import { Report } from './detail/report';

enum ReportType {
  Weekly = 1,
  Monthly
}

export default function ReportList() {
  const [dataSource, setDataSource] = useState<PageResult<Report[]>>();
  const { numberedRange, setRange } = useRange();
  const [store, setStore] = useStore('reportList');
  const [searchParams, setSearchParams] = useSearchParams({ type: `${ReportType.Weekly}` });
  const typeParamValue = searchParams.get('type');
  const type = typeParamValue ? (Number(typeParamValue) as ReportType) : undefined;

  const fetchReports = (
    store: Store['reportList'],
    from: number,
    to: number,
    type = ReportType.Weekly
  ) => {
    const {
      pagedOptions: { index, size }
    } = store;
    getReports(index, size, from, to, type).then(setDataSource);
  };

  useEffect(() => {
    if (numberedRange) {
      const [from, to] = numberedRange;
      fetchReports(store, from, to, type);
    }
  }, [store, numberedRange, type]);

  const columns = [
    {
      title: intl.get('NAME'),
      dataIndex: 'reportName',
      key: 'reportName'
    },
    {
      title: intl.get('REPORT_DATE'),
      dataIndex: 'reportDate',
      key: 'reportDate',
      render: (text: number) => Dayjs.format(text)
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (_: string, record: Report) => {
        return (
          <Link to={`/reports/${record.id}`} state={record}>
            查看报告
          </Link>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_REPORTS')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={ds}
        header={{
          toolbar: (
            <Space>
              <Segmented
                options={pickOptionsFromNumericEnum(ReportType, 'report.type').map((opt) => ({
                  ...opt,
                  label: intl.get(opt.label)
                }))}
                onChange={(value) => setSearchParams({ type: `${value}` })}
              />
              <RangeDatePicker onChange={setRange} />
            </Space>
          )
        }}
        pagination={{
          ...paged,
          onChange: (index, size) =>
            setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
        }}
        rowKey={(row) => row.id}
      />
    </Content>
  );
}

function getReports(
  page: number,
  size: number,
  from: number,
  to: number,
  type = ReportType.Weekly
) {
  return request
    .get<PageResult<Report[]>>('/reports', { page, size, from, to, type })
    .then(GetResponse);
}

export function downloadReport(filename: string) {
  return request.download<any>(`/reports/${filename}`);
}
