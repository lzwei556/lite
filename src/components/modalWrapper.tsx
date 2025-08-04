import React from 'react';
import { Modal, ModalProps } from 'antd';

export const ModalWrapper = (props: ModalProps) => {
  return (
    <Modal
      {...props}
      styles={{
        body: { maxHeight: 600, overflowY: 'auto', overflowX: 'hidden', marginTop: 20 },
        footer: { marginTop: 8 }
      }}
    />
  );
};
