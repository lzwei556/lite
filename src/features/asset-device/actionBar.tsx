import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { AssetRow } from '../../asset-common';
import { ModalFormProps } from '../../types/common';
import { Create } from '../monitoring-point-device';
import { IconButton } from '../../components';
import { Translation } from 'locales/utils';

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
      <IconButton
        icon={<PlusOutlined />}
        onClick={() => {
          setOpen(true);
        }}
        tooltipProps={{
          title: Translation.createSth('monitoring.points')
        }}
        type='primary'
      />
      <Create {...commonProps} asset={asset} />
    </>
  );
};
