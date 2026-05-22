import { Asset,  AssetRow } from 'asset-common';
import { Card, Descriptions, Link } from 'components';
import { AssetTree, PrimaryAsset } from 'domain/asset';
import { FlangeMonitoringPointsCircleChart, InclinationOffsetsChart } from 'features/feature-data';
import { Icon } from 'pages/asset/primary/icons';
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
            {PrimaryAsset.Enum.Flange === type ? (
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
