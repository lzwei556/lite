import { createStyles } from 'antd-style';
import { A4_SIZE, PAGE_GAP } from './report';

export const useStyles = createStyles(({ token, css }) => {
  return {
    report: css`
      margin: auto;
      width: ${A4_SIZE.width}${A4_SIZE.unit};
      min-height: ${A4_SIZE.height}${A4_SIZE.unit};
      color: ${token.colorText};
      font-family: nsimsun, FangSong, sans-serif;
      font-size: 20px;
      line-height: 2.5;
      .page {
        position: relative;
        margin-bottom: ${PAGE_GAP}px;
        padding: ${A4_SIZE.padding}${A4_SIZE.unit};
        height: ${A4_SIZE.height}${A4_SIZE.unit};
        background-color: ${token.colorBgContainer};
        .container {
          display: flex;
          justify-content: center;
        }
        h1 {
          font-size: 2em;
        }
        h2 {
          font-size: 1.5em;
        }
        h3 {
          font-size: 1.2em;
        }
        h1.title,
        h2.title,
        h3.title {
          text-align: center;
        }
        .value {
          padding: 0 3px;
          font-family: monospace;
        }
        .text-list {
          list-style: none;
          > li.item {
            display: flex;
            > .index {
              flex-shrink: 0;
              width: 2em;
            }
            > .desc {
              margin-bottom: 0;
            }
          }
        }
        &.index {
          .cover {
            margin-bottom: 48px;
            width: 100%;
          }
          .introduce {
            margin-top: 96px;
          }
        }
        &.status {
          .title {
            margin-top: 30px;
            text-align: center;
          }
        }
        &.iso {
          .title {
            text-align: center;
            margin-bottom: 0;
          }
        }
        &.alarm > .alarm-record-table + .alarm-record-table {
          margin-top: 48px;
        }
      }
    `,
    value: css`
      padding: 0 3px;
      font-family: monospace;
    `
  };
});
