import React from 'react';
import { Button, Col, ModalProps, Row, Tree, message } from 'antd';
import { Translation } from 'locales/utils';
import JSZip from 'jszip';
import { useRange, RangeDatePicker } from '../../components';
import { getFilename } from '../../utils/format';
import { ModalWrapper } from '../../components/modalWrapper';
import { mapTree, tree2List } from '../../utils/tree';
import { AssetRow, downloadHistory } from '../../asset-common';
import { combine } from './tree';
import { MonitoringPointType } from 'common';
import { downloadFile } from 'utils';
import { useI18n } from 'providers/i18n';

export const BatchDownlaodHistoryDataModal = ({
  assets,
  ...rest
}: { assets: AssetRow[] } & ModalProps) => {
  const { numberedRange, setRange } = useRange();
  const [selectedIds, setSelectedIds] = React.useState<[number, number][]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const { language } = useI18n();

  const getTreedata = (assets: AssetRow[]) => {
    if (assets.length > 0) {
      const mixedTree = mapTree(assets, (asset) => combine(asset));
      return mapTree(mixedTree, (mix) => {
        return {
          ...mix,
          key: mix.type < 10000 ? `${mix.id}-${mix.type}` : `${mix.id}`
        };
      });
    }
  };

  const treeData = getTreedata(assets);

  const handleDownload = (ids: [number, number][]) => {
    const [from, to] = numberedRange;
    const fetchs = ids.map(([id, type]) => {
      const properties = MonitoringPointType.Key.getProperties(type);
      return downloadHistory(id, from, to, JSON.stringify(properties.map((p) => p.key)), language);
    });
    Promise.all(fetchs)
      .then((datas) => {
        if (ids.length === 1) {
          datas.forEach((res, i) => {
            downloadFile(
              window.URL.createObjectURL(new Blob([res.data])),
              getFilename(res, ids[i][0])
            );
          });
        } else if (ids.length >= 1) {
          const zip = new JSZip();
          datas.forEach((res, i) => {
            if (res.status === 200) {
              zip.file(getFilename(res, ids[i][0]), new Blob([res.data as any]));
            }
          });
          zip.generateAsync({ type: 'blob' }).then((content) => {
            downloadFile(
              window.URL.createObjectURL(content),
              `${Translation.get('common.data')}.zip`
            );
          });
        }
      })
      .catch(() => message.error(Translation.failureDo('common.action.fetch')))
      .finally(() => {
        setLoading(false);
        setLoading2(false);
      });
  };

  return (
    <ModalWrapper
      title={Translation.get('common.action.download')}
      {...rest}
      okButtonProps={{ disabled: selectedIds.length === 0 }}
      footer={[
        <Button key='cancel' onClick={(e) => rest.onCancel && rest.onCancel(e as any)}>
          {Translation.get('common.action.cancel')}
        </Button>,
        <Button
          key='ok'
          onClick={() => {
            setLoading2(true);
            handleDownload(selectedIds);
          }}
          disabled={selectedIds.length === 0}
          loading={loading2}
          type='primary'
        >
          {Translation.get('common.ok')}
        </Button>,
        <Button
          key='all'
          loading={loading}
          onClick={() => {
            const mixedTree = mapTree(assets, (asset) => combine(asset));
            const list = tree2List(mixedTree);
            const points = list.filter((item) => item.type > 10000);
            if (points.length > 0) {
              setLoading(true);
              handleDownload(
                points
                  .map(({ id }) => `${id}`)
                  .map((id) => [Number(id.split('-')[0]), Number(id.split('-')[1])])
              );
            }
          }}
          color='primary'
          variant='outlined'
        >
          {Translation.doSth('common.action.download', 'common.all')}
        </Button>
      ]}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <RangeDatePicker onChange={setRange} />
        </Col>
        <Col span={24}>
          <Tree
            checkable={true}
            onCheck={(keys: any) => {
              if (keys && Array.isArray(keys) && keys.length > 0) {
                setSelectedIds(
                  keys
                    .filter((k) => Number(k.split('-')[1] > 10000))
                    .map((k) => [Number(k.split('-')[0]), Number(k.split('-')[1])])
                );
              } else {
                setSelectedIds([]);
              }
            }}
            treeData={treeData as any}
            fieldNames={{ key: 'key', title: 'name' }}
            defaultExpandAll={true}
            height={500}
          />
        </Col>
      </Row>
    </ModalWrapper>
  );
};
