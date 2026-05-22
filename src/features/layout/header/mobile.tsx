import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';
import { Flex } from 'components';

export const Mobile = ({
  brand,
  onMenuClick
}: {
  brand: React.ReactNode;
  onMenuClick: () => void;
}) => {
  const styles = { color: '#fff', fontSize: 18 };

  return (
    <Flex>
      <MenuOutlined onClick={onMenuClick} style={styles} />
      <Flex style={{ flex: 1, justifyContent: 'center' }}>{brand}</Flex>
      <Dropdown menu={{ items: [{ key: 'logout', label: intl.get('LOGOUT') }] }}>
        <UserOutlined style={styles} />
      </Dropdown>
    </Flex>
  );
};
