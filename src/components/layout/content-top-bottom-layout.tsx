import { Spin } from 'antd';
import { Flex } from '../flex';
import React from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  contentWrapper: css`
    flex: 1;
    margin-top: 16px;
    .ant-spin-container {
      height: 100%;
      max-height: 100%;
    }
  `
}));

export const ContentTopBottomLayout = ({
  content,
  header,
  loading
}: {
  content: React.ReactNode;
  header: React.ReactNode;
  loading?: boolean;
}) => {
  const { styles } = useStyles();

  return (
    <Flex vertical={true}>
      {header}
      {loading != null ? (
        <Spin wrapperClassName={styles.contentWrapper} spinning={loading}>
          {content}
        </Spin>
      ) : (
        <div className={styles.contentWrapper}>{content}</div>
      )}
    </Flex>
  );
};
