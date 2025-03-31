import { useEffect, useState } from 'react';
import { Button, message, Popconfirm, Space, Upload } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import {
  PagingFirmwaresRequest,
  RemoveFirmwareRequest,
  UploadFirmwareRequest
} from '../../apis/firmware';
import { Dayjs } from '../../utils';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { PageResult } from '../../types/page';
import { Firmware } from '../../types/firmware';
import { Store, useStore } from '../../hooks/store';
import { Table, transformPagedresult } from '../../components';

const FirmwarePage = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<PageResult<Firmware[]>>();
  const [store, setStore, gotoPage] = useStore('firmwareList');

  const fetchFirmwares = (store: Store['firmwareList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingFirmwaresRequest(index, size).then(setDataSource);
  };

  useEffect(() => {
    fetchFirmwares(store);
  }, [store]);

  const onFileChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setIsUploading(true);
    }
  };

  const onUpload = (options: any) => {
    const formData = new FormData();
    formData.append('file', options.file);
    UploadFirmwareRequest(formData).then((res) => {
      setIsUploading(false);
      if (res.code === 200) {
        message.success(intl.get('FIRMWARE_UPLOADED_SUCCESSFUL')).then(() => {
          if (dataSource) {
            const { size, page, total } = dataSource;
            gotoPage({ size, total, index: page }, 'next');
          }
        });
      } else {
        message.error(`${intl.get('FAILED_TO_UPLOAD')}${intl.get(res.msg).d(res.msg)}`).then();
      }
    });
  };

  const onDelete = (id: number) => {
    RemoveFirmwareRequest(id).then((_) => {
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
    });
  };

  const columns = [
    {
      title: intl.get('NAME'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl.get('SOFTWARE_VERSION'),
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: intl.get('HARDWARE_VERSION'),
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: 'CRC',
      dataIndex: 'crc',
      key: 'crc'
    },
    {
      title: intl.get('BUILD_DATE'),
      dataIndex: 'buildTime',
      key: 'buildTime',
      render: (text: number) => Dayjs.format(text)
    },
    {
      title: intl.get('OPERATION'),
      key: 'action',
      render: (text: any, record: any) => {
        return (
          <Space>
            <Popconfirm
              placement='left'
              title={intl.get('DELETE_FIRMWARE_CONFIRM_WITH_NAME', { name: record.name })}
              onConfirm={() => onDelete(record.id)}
              okText={intl.get('DELETE')}
              cancelText={intl.get('CANCEL')}
            >
              <Button type='text' size='small' icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const { paged, ds } = transformPagedresult(dataSource);

  return (
    <Table
      columns={columns}
      dataSource={ds}
      header={{
        title: intl.get('MENU_FIRMWARE_LIST'),
        toolbar: [
          <HasPermission value={Permission.FirmwareAdd}>
            <Upload
              accept={'.bin'}
              name='file'
              customRequest={onUpload}
              showUploadList={false}
              onChange={onFileChange}
            >
              <Button type='primary' loading={isUploading}>
                {isUploading
                  ? intl.get('FIRMWARE_IS_UPLOADING_PROMPT')
                  : intl.get('UPLOAD_FIRMWARE')}
                {isUploading ? null : <UploadOutlined />}
              </Button>
            </Upload>
          </HasPermission>
        ]
      }}
      pagination={{
        ...paged,
        onChange: (index, size) => setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
      }}
      rowKey={(row) => row.id}
    />
  );
};

export default FirmwarePage;
