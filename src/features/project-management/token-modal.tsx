import { Card, Modal, ModalProps, Typography } from 'antd';
import { ActionModalContext } from 'common/action';
import React from 'react';
import intl from 'react-intl-universal';

export const TokenModal = ({ close, record, ...rest }: ModalProps & ActionModalContext) => {
  const token = record.token;
  return (
    <Modal
      {...rest}
      onCancel={close}
      title={intl.get('ACCESS_CREDENTIALS')}
      footer={(_, { CancelBtn }) => <CancelBtn />}
    >
      <Card size='small'>
        <Typography.Text copyable={{ text: token }}>{token}</Typography.Text>
      </Card>
    </Modal>
  );
};
