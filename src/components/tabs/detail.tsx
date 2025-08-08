import React from 'react';
import { Col, TabsProps } from 'antd';
import { TitleExtraLayout } from '../layout/title-extra';
import { Grid } from '../grid';
import { Tabs } from './tabs';

export type TabsDetailsItems = { key: string; label: string; content: React.ReactNode }[];

export const TabsDetail = ({
  items,
  title,
  tabBarExtraContent
}: {
  items: TabsDetailsItems;
  title: React.ReactNode;
  tabBarExtraContent?: TabsProps['tabBarExtraContent'];
}) => {
  const [activeKey, setActiveKey] = React.useState(items?.[0]?.key);

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={title}
          extra={
            items.length > 0 && (
              <Tabs
                activeKey={activeKey}
                items={items}
                onChange={setActiveKey}
                size='large'
                tabBarStyle={{ margin: 0 }}
                tabBarExtraContent={tabBarExtraContent}
              />
            )
          }
        />
      </Col>
      {items.length > 0 && (
        <Col span={24}>
          {items.find((item) => item.key === (activeKey ?? items?.[0]?.key))?.content}
        </Col>
      )}
    </Grid>
  );
};
