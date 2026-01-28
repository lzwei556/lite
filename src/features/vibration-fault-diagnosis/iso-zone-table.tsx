import { createStyles } from 'antd-style';
import { ColorDanger, ColorHealth, ColorInfo, ColorWarn } from 'constants/color';
import React from 'react';

const zoneColors = [
  ColorHealth, // A
  ColorInfo, // B
  ColorWarn, // C
  ColorDanger // D
];

const useStyles = createStyles(({ css, token }) => ({
  container: {
    marginTop: 20
  },

  header: {
    display: 'flex'
  },

  row: {
    display: 'flex'
  },

  titleCol: {
    width: 120,
    paddingRight: 8,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRight: `1px solid ${token.colorBorder}`
  },

  gridArea: {
    position: 'relative',
    flex: 1
  },

  boundary: {
    position: 'absolute',
    top: -22,
    transform: 'translateX(-50%)',
    color: token.colorText
  },

  zones: {
    display: 'grid',
    gridTemplateColumns: 'repeat(var(--zone-count), 1fr)'
  },

  cell: {
    height: 40,
    borderRight: `1px solid ${token.colorBorder}`,
    borderBottom: `1px solid ${token.colorBorder}`
  },

  headerCell: {
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  barLayer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none'
  },

  bar: {
    position: 'absolute',
    left: 0,
    top: '50%',
    height: 8,
    transform: 'translateY(-50%)',
    background: token.colorSuccess,
    borderRadius: 4,
    minWidth: 12
  },

  value: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(6px, -50%)',
    whiteSpace: 'nowrap',
    fontWeight: 600
  }
}));

type Row = {
  title: string;
  score: number;
};

type Props = {
  zones: string[];
  boundaries: number[];
  rows: Row[];
  max: number;
};

export const ZoneScoreTable: React.FC<Props> = ({ zones, boundaries, rows, max }) => {
  const { styles, cx } = useStyles();
  return (
    <div className={styles.container} style={{ ['--zone-count' as any]: zones.length }}>
      {/* header */}
      <div className={styles.header}>
        <div className={styles.titleCol} />

        <div className={styles.gridArea}>
          {boundaries.map((b, i) => (
            <span
              key={b}
              className={styles.boundary}
              style={{
                left: `${((i + 1) / zones.length) * 100}%`
              }}
            >
              {b}
            </span>
          ))}

          <div className={styles.zones}>
            {zones.map((z, i) => (
              <div
                key={z}
                className={cx(styles.cell, styles.headerCell)}
                style={{ background: zoneColors[i] }}
              >
                {z}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* rows */}
      {rows.map((r) => {
        const width = getBarWidthPercent(r.score, [...boundaries, max], zones.length);
        const MIN_BAR_PX = 12;

        const labelLeft = `max(${width}%, ${MIN_BAR_PX}px)`;
        return (
          <div key={r.title} className={styles.row}>
            <div className={styles.titleCol}>
              <span>{r.title}</span>
            </div>

            <div className={styles.gridArea}>
              <div className={styles.zones}>
                {zones.map((_, i) => (
                  <div key={i} className={styles.cell} />
                ))}
              </div>

              <div className={styles.barLayer}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${width}%`,
                    background: zoneColors[getZoneIndex(r.score, boundaries)]
                  }}
                />
                <span className={styles.value} style={{ left: labelLeft }}>
                  {r.score}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getZoneIndex = (score: number, boundaries: number[]) => {
  for (let i = 0; i < boundaries.length; i++) {
    if (score <= boundaries[i]) return i;
  }
  return boundaries.length;
};

const getBarWidthPercent = (score: number, boundaries: number[], zoneCount: number) => {
  const all = [0, ...boundaries];
  const zoneWidth = 100 / zoneCount;

  for (let i = 0; i < boundaries.length; i++) {
    if (score <= boundaries[i]) {
      const start = all[i];
      const end = boundaries[i];
      const ratio = (score - start) / (end - start);
      return zoneWidth * (i + ratio);
    }
  }

  // beyond last boundary → full width
  return 100;
};
