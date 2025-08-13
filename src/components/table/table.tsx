import React from 'react';
import {
  Checkbox,
  Col,
  Popover,
  Table as AntTable,
  TableProps,
  Space as AntSpace,
  Typography,
  TablePaginationConfig
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Grid } from '../grid';
import { Flex } from '../flex';
import { Card, CardProps } from '../card/card';
import { Space } from '../../common';
import { PageResult } from '../../types/page';
import { IconButton } from '../icon-button';

type Header = {
  enableSettingColumnsCount?: boolean;
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
};

type Props<T> = Omit<TableProps<T>, 'title'> & {
  cardProps?: CardProps;
  header?: Header;
  noScroll?: boolean;
};

export function Table<T>({
  cardProps,
  columns = [],
  pagination,
  header,
  noScroll,
  scroll,
  size = 'small',
  tableLayout = 'auto',
  ...rest
}: Props<T>) {
  const [visibledColumnKeys, setVisibledColumnKeys] = React.useState<string[]>(
    columns.filter((c) => c.hidden === false).map((c) => c.key as string)
  );

  let scrollProps: Props<T>['scroll'];
  if (!noScroll) {
    if (scroll) {
      scrollProps = scroll;
    } else if (rest.dataSource && rest.dataSource.length > 0) {
      scrollProps = { x: 1000 };
    }
  }

  return (
    <Card {...cardProps}>
      {header && (
        <Head
          columnsSettingBtn={
            header?.enableSettingColumnsCount ? (
              <SettingsButton
                columns={columns}
                visibledColumnKeys={visibledColumnKeys}
                setVisibledColumnKeys={setVisibledColumnKeys}
              />
            ) : undefined
          }
          header={header}
        />
      )}
      <AntTable
        {...rest}
        columns={columns.map((c) => {
          if (c.hasOwnProperty('hidden')) {
            return { ...c, hidden: !visibledColumnKeys.includes(c.key as string) };
          } else {
            return c;
          }
        })}
        pagination={
          pagination && {
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
            style: { marginBlockEnd: 0 }
          }
        }
        scroll={scrollProps}
        size={size}
        tableLayout={tableLayout}
      />
    </Card>
  );
}

function Head({ columnsSettingBtn, header }: { columnsSettingBtn?: JSX.Element; header: Header }) {
  const { enableSettingColumnsCount, title, toolbar } = header;
  if (!title && !toolbar && !enableSettingColumnsCount) {
    return null;
  }
  let justify: React.CSSProperties['justifyContent'] = 'flex-end';
  if (title && (toolbar || enableSettingColumnsCount)) {
    justify = 'space-between';
  } else if (title) {
    justify = 'flex-start';
  }
  return (
    <Flex justify={justify} style={{ paddingBottom: Space }}>
      <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>{title}</Typography.Text>
      <AntSpace>
        {toolbar}
        {enableSettingColumnsCount && columnsSettingBtn}
      </AntSpace>
    </Flex>
  );
}

function SettingsButton<T>({
  columns = [],
  visibledColumnKeys,
  setVisibledColumnKeys
}: {
  columns: Props<T>['columns'];
  visibledColumnKeys: string[];
  setVisibledColumnKeys: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Popover
      arrow={false}
      content={
        <Checkbox.Group value={visibledColumnKeys} onChange={setVisibledColumnKeys}>
          <Grid gutter={[0, 0]}>
            {columns
              .filter((c) => c.hasOwnProperty('hidden'))
              .map((c) => (
                <Col span={24} key={c.key}>
                  <Checkbox value={c.key}>{c.title as React.ReactNode}</Checkbox>
                </Col>
              ))}
          </Grid>
        </Checkbox.Group>
      }
      overlayStyle={{ maxWidth: 300, maxHeight: 600, overflow: 'auto' }}
      placement='leftBottom'
      trigger='click'
    >
      <IconButton
        color='primary'
        icon={<SettingOutlined />}
        size='small'
        tooltipProps={{ title: intl.get('set.columns') }}
        variant='outlined'
      />
    </Popover>
  );
}

export function transformPagedresult<T>(pageResult?: PageResult<T>): {
  paged: TablePaginationConfig;
  ds: T;
} {
  if (!pageResult) {
    return { paged: {}, ds: [] as T };
  }
  const { page, size, total, result } = pageResult;
  return { paged: { current: page, pageSize: size, total }, ds: result };
}
