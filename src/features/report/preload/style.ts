import { createStyles } from 'antd-style';

export const useReportBaseStyles = createStyles(({ css }) => ({
  section: css`
    margin: 16px 0;
  `,

  title: css`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  `,

  subTitle: css`
    margin: 12px 0 8px;
  `,

  text: css`
    text-indent: 2em;
    margin: 2px 0;
    font-size: 13px;
  `,

  noIndent: css`
    margin: 2px 0;
    font-size: 13px;
  `
}));
