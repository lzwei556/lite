import React from 'react';
import intl from 'react-intl-universal';
import { Card, Descriptions, Link } from '../../../components';
import { ASSET_PATHNAME, AssetRow, Asset, Points } from '../../../asset-common';
import * as Flange from '../flange';
import * as Tower from '../tower';
import { useHistoryDatas } from '../utils';
import { flange } from '../constants';
import { Icon } from '../icon';

export const OverviewCard = ({ asset }: { asset: AssetRow }) => {
  const { id, name, statistics: flangeStatistics, type } = asset;
  const realPoints = Points.filter(asset.monitoringPoints);
  const historyData = useHistoryDatas(asset);

  const statistics = Asset.Statistics.resolveDescendant(flangeStatistics);
  const style = { left: '-24px', height: 450 };

  return (
    <Card styles={{ body: { padding: 24 } }}>
      <Card.Meta
        avatar={<Icon asset={asset} height={30} width={30} />}
        description={
          <>
            <Descriptions
              column={2}
              contentStyle={{ transform: 'translate(-20px)' }}
              items={statistics.map(({ name, value }) => ({
                label: intl.get(name),
                children: value
              }))}
              style={{ marginTop: 16 }}
            />
            {type === flange.type ? (
              <Flange.PointsScatterChart asset={asset} style={style} />
            ) : (
              <Tower.PointsScatterChart
                data={
                  historyData?.map((h) => {
                    return {
                      name: h.name,
                      history: h.data,
                      height: h.height,
                      radius: h.radius
                    };
                  }) ?? []
                }
                showTitle={false}
                style={style}
                type={realPoints?.[0]?.type}
              />
            )}
          </>
        }
        title={<Link to={`/${ASSET_PATHNAME}/${id}-${type}`}>{name}</Link>}
      />
    </Card>
  );
};
