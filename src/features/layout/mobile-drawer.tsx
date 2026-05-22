import { Divider, Drawer, DrawerProps } from 'antd';
import { ActionModalContext } from 'common/action';
import React from 'react';
import { Navigation } from './navigation';
import { ProjectsSelect } from './project';

export const MobileDrawer = ({ open, close, ...rest }: DrawerProps & ActionModalContext) => {
  return (
    <Drawer
      {...rest}
      closable={false}
      open={open}
      onClose={close}
      placement='left'
      styles={{ body: { paddingLeft: 0, paddingRight: 0 } }}
      width='60%'
    >
      <Navigation mode='inline' />
      <Divider />
      <div style={{ paddingLeft: 24, paddingBottom: 100 }}>
        <ProjectsSelect />
      </div>
    </Drawer>
  );
};
