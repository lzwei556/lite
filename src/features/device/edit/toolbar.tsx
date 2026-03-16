import React from 'react';
import { Tooltip, Space } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { CanCopySettings } from './can-copying-settings';
import { FormCommonProps, FormSubmitButtonProps } from '../settings-common';
import { SaveIconButton } from '../../../components';

type Props = Omit<FormCommonProps, 'device'> &
  Partial<Pick<FormCommonProps, 'device'>> &
  FormSubmitButtonProps;

export const Toolbar = (props: Props) => {
  const { saveButtonProps, selectButtonChildren } = useProps(props);
  return (
    <Space>
      <SaveIconButton {...saveButtonProps} />
      {props.device && (
        <Tooltip title={selectButtonChildren}>
          <CanCopySettings
            {...{
              device: props.device,
              form: props.form,
              color: 'primary',
              icon: <SelectOutlined />,
              variant: 'outlined'
            }}
          />
        </Tooltip>
      )}
    </Space>
  );
};

const useProps = (props: Props) => {
  const { form, loading, handleSubmit } = props;
  return {
    saveButtonProps: {
      onClick: () => form?.validateFields().then(handleSubmit),
      loading
    },
    selectButtonChildren: Translation.get('device.settings.apply-to-same-types')
  };
};
