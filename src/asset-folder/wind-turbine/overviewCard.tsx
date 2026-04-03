import { Asset,  AssetRow } from 'asset-common';
import { Icon } from 'asset-primary/icons';
import { Card, Descriptions, Link } from 'components';
import { AssetTree, PrimaryAssetType } from 'domain/asset';
import { FlangeMonitoringPointsCircleChart, InclinationOffsetsChart } from 'features/feature-data';
import React from 'react';
import intl from 'react-intl-universal';

export const OverviewCard = ({ asset }: { asset: AssetRow }) => {
  const { id, name, statistics: flangeStatistics, type } = asset;

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
            {PrimaryAssetType.Flange === type ? (
              <FlangeMonitoringPointsCircleChart asset={asset} style={style} />
            ) : (
              <InclinationOffsetsChart asset={asset} />
            )}
          </>
        }
        title={<Link to={`/${AssetTree.Path.Assets}/${id}-${type}`}>{name}</Link>}
      />
    </Card>
  );
};
