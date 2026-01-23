import { createStyles } from 'antd-style';
import { ColorDanger, ColorHealth, ColorInfo, ColorWarn } from 'constants/color';
import React from 'react';
import intl from 'react-intl-universal';

const useStyles = createStyles(({ css, token }) => ({
  table: css`
    position: relative;
  `,
  boundaryLayer: css`
    position: relative;
    height: 24px;
    margin-left: 160px;
  `,
  boundaryLabel: css`
    position: absolute;
    transform: translateX(-50%);
    font-size: 13px;
    color: ${token.colorText};
  `,
  headerRow: css`
    display: grid;
    grid-template-columns: 160px repeat(4, 1fr);
  `,
  cell: css`
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    /* collapsed-border strategy */
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    &.title {
      justify-content: flex-start;
      padding-left: 8px;
      border-left: 1px solid #ccc;
    }
    &.header {
      background: #f3f3f3;
      font-weight: 500;
      border-top: 1px solid #ccc;
    }
    &.active {
      color: #fff;
      font-weight: 500;
      &.A {
        background: ${ColorHealth};
      }
      &.B {
        color: ${token.colorText};
        background: ${ColorInfo};
      }
      &.C {
        background: ${ColorWarn};
      }
      &.D {
        background: ${ColorDanger};
      }
    }
  `
}));

type Row = {
  title: string;
  score: number;
};

type Props = {
  zones: string[];
  boundaries: number[];
  rows: Row[];
};

export const ZoneScoreTable: React.FC<Props> = ({ zones, boundaries, rows }) => {
  const { styles, cx } = useStyles();
  const getZoneIndex = (score: number) => {
    const idx = boundaries.findIndex((b) => score <= b);
    return idx === -1 ? zones.length - 1 : idx;
  };

  return (
    <div className={styles.table}>
      {/* Boundary labels */}
      <div className={styles.boundaryLayer}>
        {boundaries.map((b, i) => (
          <span
            key={b}
            className={styles.boundaryLabel}
            style={{ left: `${((i + 1) / zones.length) * 100}%` }}
          >
            {b}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={cx(styles.cell, 'header', 'title')}>{intl.get('common.component')}</div>
        {zones.map((z) => (
          <div key={z} className={cx(styles.cell, 'header')}>
            {z}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row) => {
        const zoneIndex = getZoneIndex(row.score);

        return (
          <div key={row.title} className={styles.headerRow}>
            <div className={cx(styles.cell, 'title')}>{row.title}</div>

            {zones.map((zone, i) => (
              <div key={i} className={cx(styles.cell, zone, i === zoneIndex ? 'active' : '')}>
                {i === zoneIndex ? row.score : ''}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
