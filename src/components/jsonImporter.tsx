import * as React from 'react';
import { ButtonProps, message, Upload, UploadProps } from 'antd';
import { ImportOutlined, InboxOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton } from './icon-button';

export function JsonImporter<JSONContent>({
  onUpload,
  dragger,
  iconButtonProps
}: {
  onUpload: (json: JSONContent) => Promise<void>;
  dragger?: boolean;
  iconButtonProps?: ButtonProps;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isJson = file.type === 'application/json';
    if (!isJson) {
      message.error(intl.get('only.json.file'));
    } else {
      try {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          setLoading(true);
          if (typeof reader.result === 'string') {
            const json: JSONContent = JSON.parse(reader.result);
            onUpload(json).finally(() => setLoading(false));
          }
        };
      } catch (error) {
        message.error(intl.get('FAILED_TO_IMPORT'));
        setLoading(false);
      }
    }
    return false;
  };

  const props: UploadProps = { beforeUpload: handleBeforeUpload, showUploadList: false };

  if (dragger) {
    return (
      <Upload.Dragger {...props}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>{intl.get('UPLOAD_NETWORK_PROMPT')}</p>
        <p className='ant-upload-hint'>{intl.get('UPLOAD_NETWORK_HINT')}</p>
      </Upload.Dragger>
    );
  }

  return (
    <Upload {...props}>
      <IconButton
        {...iconButtonProps}
        icon={<ImportOutlined />}
        loading={loading}
        tooltipProps={{ title: intl.get('IMPORT_SETTINGS') }}
        type='primary'
      />
    </Upload>
  );
}
