import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { AssetRow } from '../../asset-common';
import { ModalFormProps } from '../../types/common';
import { Create } from '../monitoring-point-device';

export const ActionBar = ({ asset, onSuccess }: { asset?: AssetRow; onSuccess: () => void }) => {
  const [open, setOpen] = React.useState(false);

  const commonProps: ModalFormProps = {
    onSuccess: () => {
      onSuccess();
      reset();
    },
    open,
    onCancel: () => {
      reset();
    }
  };

  const reset = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        type='primary'
      >
        {intl.get('CREATE_SOMETHING', { something: intl.get('monitoring.points') })}
        <PlusOutlined />
      </Button>
      <Create {...commonProps} asset={asset} />
    </>
  );
};
