import * as React from 'react';
import { ButtonProps, message, Upload, UploadProps } from 'antd';
import { ImportOutlined, InboxOutlined } from '@ant-design/icons';
import { IconButton } from './icon-button';
import { Translation } from 'locales/utils';

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
      message.error(Translation.get('feedback.prompt.upload.json'));
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
        message.error(Translation.failureDo('common.action.import'));
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
        <p className='ant-upload-text'>{Translation.get('feedback.prompt.upload.drag')}</p>
        <p className='ant-upload-hint'>{Translation.get('feedback.prompt.upload.json')}</p>
      </Upload.Dragger>
    );
  }

  return (
    <Upload {...props}>
      <IconButton
        {...iconButtonProps}
        icon={<ImportOutlined />}
        loading={loading}
        tooltipProps={{ title: Translation.doSth('common.action.import', 'common.settings') }}
        type='primary'
      />
    </Upload>
  );
}
