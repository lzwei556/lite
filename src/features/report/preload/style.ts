import { createStyles } from 'antd-style';

export const useReportBaseStyles = createStyles(({ css }) => ({
  section: css`
    margin-bottom: 14px;
  `,

  title: css`
    font-weight: bold;
    margin-bottom: 6px;
  `,

  subTitle: css`
    margin: 6px 0 2px;
  `,

  text: css`
    text-indent: 2em;
    margin: 2px 0;
    font-size: 13px;
  `,

  noIndent: css`
    margin: 2px 0;
    font-size: 13px;
  `,
}));
