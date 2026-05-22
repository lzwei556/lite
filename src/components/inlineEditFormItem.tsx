import React from 'react';
import { Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { EditIconButton, SaveIconButton, IconButton } from 'components';

export type InlineEditFormItemProps = {
  /** 编辑模式下渲染的表单项 */
  children: React.ReactNode;
  /** 展示模式下显示的文本值 */
  value?: string;
  /** 值为空时展示的占位文字 */
  emptyText?: string;
  /** 保存中的 loading 状态 */
  loading?: boolean;
  /** 保存回调；resolve 则退出编辑模式，reject 则保持编辑状态 */
  onSave: () => Promise<void>;
  /** 取消回调，用于重置表单等清理工作 */
  onCancel?: () => void;
};

export const InlineEditFormItem = ({
  children,
  value,
  emptyText = intl.get('NOT_BOUND_PROMPT'),
  loading,
  onSave,
  onCancel
}: InlineEditFormItemProps) => {
  const [editable, setEditable] = React.useState(false);

  const handleSave = async () => {
    try {
      await onSave();
      setEditable(false);
    } catch {
      // 保存失败，保持编辑模式让用户重试
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setEditable(false);
  };

  return (
    <Space>
      {editable ? (
        <>
          {children}
          <div>
            <SaveIconButton
              icon={<CheckOutlined />}
              loading={loading}
              onClick={handleSave}
              variant='text'
            />
            <IconButton
              color='danger'
              disabled={loading}
              icon={<CloseOutlined />}
              onClick={handleCancel}
              size='small'
              variant='text'
            />
          </div>
        </>
      ) : (
        <>
          {value || emptyText}
          <EditIconButton color='primary' onClick={() => setEditable(true)} variant='text' />
        </>
      )}
    </Space>
  );
};
