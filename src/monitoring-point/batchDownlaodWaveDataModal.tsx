import React from 'react';
import { Button, ModalProps } from 'antd';
import intl from 'react-intl-universal';
import { getFilename } from '../utils/format';
import { Table } from '../components';
import { ModalWrapper } from '../components/modalWrapper';
import { isMobile } from '../utils/deviceDetection';
import { Dayjs } from '../utils';
import { batchDownload } from './services';

export const BatchDownlaodWaveDataModal = ({
  id,
  isVibration = false,
  type,
  timestamps,
  ...rest
}: {
  id: number;
  type: string;
  timestamps: { timestamp: number }[];
  isVibration?: boolean;
} & ModalProps) => {
  const [selectedBatchDownloadTimestamps, setSelectedBatchDownloadTimestamps] = React.useState<
    number[]
  >([]);

  const handleDownlaod = (timestamps: number[]) => {
    batchDownload(id, type, timestamps, isVibration).then((res) => {
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data as any]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', getFilename(res));
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  return (
    <ModalWrapper
      title={intl.get('BATCH_DOWNLOAD')}
      {...rest}
      okButtonProps={{ disabled: selectedBatchDownloadTimestamps.length === 0 }}
      footer={[
        <Button key='cancel' onClick={(e) => rest.onCancel && rest.onCancel(e as any)}>
          {intl.get('CANCEL')}
        </Button>,
        <Button
          key='all'
          onClick={() => {
            handleDownlaod(timestamps.map((item) => item.timestamp));
          }}
        >
          {intl.get('DOWNLOAD_ALL')}
        </Button>,
        <Button
          key='ok'
          type='primary'
          onClick={() => {
            handleDownlaod(selectedBatchDownloadTimestamps);
          }}
          disabled={selectedBatchDownloadTimestamps.length === 0}
        >
          {intl.get('OK')}
        </Button>
      ]}
    >
      <Table
        scroll={{ y: isMobile ? 200 : 500 }}
        showHeader={false}
        columns={[
          {
            title: intl.get('TIMESTAMP'),
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '80%',
            render: (timestamp: number) => Dayjs.format(timestamp)
          }
        ]}
        pagination={false}
        dataSource={timestamps}
        rowSelection={{
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedBatchDownloadTimestamps(selectedRowKeys as number[]);
          }
        }}
        rowKey='timestamp'
      />
    </ModalWrapper>
  );
};
