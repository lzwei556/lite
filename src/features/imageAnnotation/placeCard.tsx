import React from 'react';
import { List, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Card, Flex } from '../../components';
import { Space } from '../../common';
import { useGlobalStyles } from '../../styles';
import { PropertyItem } from '../../asset-model';
import { truncate } from '../../utils';

const cardStyles = { BorderWidth: 1, Padding: Space / 2, width: 220, height: 210 };

const useStyles = createStyles(({ token, css }) => ({
  listItem: css`
    padding: 1px 2px !important;
    cursor: pointer;
    &:hover,
    &.selected {
      background-color: ${token.colorInfoBgHover};
    }
  `
}));

export type PalceCardItem = PropertyItem & {
  index?: number;
  selected: boolean;
  onClick?: (item: Pick<PropertyItem, 'propertyKey' | 'axisKey'>) => void;
};

export type PlaceCardProps = {
  title: React.ReactNode;
  items: PalceCardItem[];
  footer?: React.ReactNode;
  style?: React.CSSProperties;
};

export const PlaceCard = ({
  selectedItem,
  title,
  items,
  footer,
  style
}: {
  selectedItem?: Partial<Pick<PalceCardItem, 'index' | 'propertyKey' | 'axisKey'>>;
} & PlaceCardProps) => {
  const { colorInfoBorderStyle } = useGlobalStyles();
  const { styles } = useStyles();

  return (
    <Card
      style={{
        ...style,
        position: 'absolute',
        border: `solid ${cardStyles.BorderWidth}px ${colorInfoBorderStyle.color}`,
        width: cardStyles.width,
        height: cardStyles.height,
        borderRadius: 4
      }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          paddingBlock: cardStyles.Padding / 2,
          paddingInline: cardStyles.Padding,
          height: '100%'
        }
      }}
    >
      <div style={{ borderBottom: `solid 1px ${colorInfoBorderStyle.color}`, textAlign: 'center' }}>
        <Typography.Text ellipsis={true}>{title}</Typography.Text>
      </div>
      <div style={{ flex: 'auto', maxHeight: '100%', overflow: 'auto' }}>
        <List
          dataSource={items.map((item) => {
            return {
              ...item,
              selected:
                selectedItem?.index === item.index &&
                selectedItem?.propertyKey === item.propertyKey &&
                selectedItem?.axisKey === item.axisKey
            };
          })}
          rowKey={(item) => `${item.propertyKey}_${item.axisKey}`}
          renderItem={(item) => {
            const { title, children, selected, onClick } = item;
            return (
              <List.Item
                className={`${styles.listItem} ${selected ? 'selected' : ''}`}
                onClick={() => onClick?.(item)}
                style={{ border: 0 }}
              >
                <Flex align='center' justify='space-between' style={{ width: '100%' }}>
                  <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                    {truncate(title, 24)}
                  </Typography.Text>
                  <span style={{ fontSize: 12 }}>{children}</span>
                </Flex>
              </List.Item>
            );
          }}
          size='small'
          style={{ top: 4 }}
        />
      </div>
      <Typography.Text
        style={{
          borderTop: `solid 1px ${colorInfoBorderStyle.color}`,
          minHeight: '1em',
          fontSize: 12
        }}
        type='secondary'
      >
        {footer}
      </Typography.Text>
    </Card>
  );
};
