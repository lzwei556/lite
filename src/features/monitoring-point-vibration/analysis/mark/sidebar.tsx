import React from 'react';
import { Button, Col } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Flex, Grid } from '../../../../components';

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const { expanded, setExpanded } = useSidebarContext();

  return expanded ? (
    <Col style={{ marginTop: 16 }} flex={'300px'}>
      <Grid>
        <Col span={24}>
          <Flex>
            <Button
              color='primary'
              icon={<DoubleRightOutlined />}
              onClick={() => setExpanded(false)}
              size='small'
              variant='outlined'
            />
          </Flex>
        </Col>
        <Col span={24}>{children}</Col>
      </Grid>
    </Col>
  ) : (
    <Button
      color='primary'
      icon={<DoubleLeftOutlined />}
      onClick={() => setExpanded(true)}
      size='small'
      style={{ marginTop: 16 }}
      variant='outlined'
    />
  );
};

const SidebarContext = React.createContext<{
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}>({ expanded: true, setExpanded: () => {} });

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>{children}</SidebarContext.Provider>
  );
};

export const useSidebarContext = () => React.useContext(SidebarContext);
