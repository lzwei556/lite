import React from 'react';
import { Navigation } from '../navigation';
import { Space } from 'antd';
import { Clock } from '../clock';
import { ProjectsSelect } from '../project';
import { AppMenu } from '../menu/app-menu';
import { Flex } from 'components';

export const Desktop = ({ brand }: { brand: React.ReactNode }) => {
  return (
    <Flex>
      {brand}
      <Flex justify='flex-start' style={{ flex: 1, marginInline: 16 }}>
        <Navigation mode='horizontal' style={{ backgroundColor: 'transparent' }} />
      </Flex>
      <Space>
        <Clock />
        <ProjectsSelect />
        <AppMenu />
      </Space>
    </Flex>
  );
};
