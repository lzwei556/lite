import { AssetModel, AssetRow } from 'asset-common';
import { UpdateFormProps } from './update-form';
import request from 'utils/request';
import { useRequest } from 'ahooks';
import { useNotificationContext } from 'providers/notification';
import intl from 'react-intl-universal';

export const useUpdateFormProps = (asset: AssetRow): UpdateFormProps => {
  const { loading, runAsync } = useUpdate();

  const { messageInstance } = useNotificationContext();
  const handleSubmit = async (values: AssetModel) => {
    try {
      const data = await runAsync(asset.id, values);
      if (data.code === 200) {
        messageInstance.success(intl.get('UPDATED_SUCCESSFUL'));
      } else {
        messageInstance.error(intl.get(data.msg).d(data.msg));
      }
    } catch (error) {
      console.log(error);
      messageInstance.error(intl.get('server.error'));
    }
  };
  return { loading, handleSubmit, asset };
};

const useUpdate = () => useRequest(updateAsset, { manual: true });

const updateAsset = async (id: number, asset: AssetModel) => {
  const { data } = await request.put(`/assets/${id}`, asset);
  return data;
};
