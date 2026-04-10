import { AssetModel } from 'asset-common';
import { UpdateFormProps } from './update-form';
import request from 'utils/request';
import { useRequest } from 'ahooks';
import { useNotificationContext } from 'providers/notification';
import intl from 'react-intl-universal';

export const useCreateFormProps = (success: () => void) => {
  const { loading, runAsync } = useAdd();

  const { messageInstance } = useNotificationContext();
  const handleSubmit = async (values: AssetModel) => {
    try {
      const data = await runAsync(values);
      if (data.code === 200) {
        messageInstance.success(intl.get('CREATED_SUCCESSFUL'));
        success();
      } else {
        messageInstance.error(intl.get(data.msg).d(data.msg));
      }
    } catch (error) {
      console.log(error);
      messageInstance.error(intl.get('server.error'));
    }
  };
  return { loading, handleSubmit };
};

const useAdd = () => useRequest(addAsset, { manual: true });

const addAsset = async (asset: AssetModel) => {
  const { data } = await request.post(`/assets`, asset);
  return data;
};

export const useUpdateFormProps = (
  id?: number,
  success?: () => void
): Omit<UpdateFormProps, 'editingAsset'> => {
  const { loading, runAsync } = useUpdate();

  const { messageInstance } = useNotificationContext();
  const handleSubmit = async (values: AssetModel) => {
    try {
      if (id) {
        const data = await runAsync(id, values);
        if (data.code === 200) {
          messageInstance.success(intl.get('UPDATED_SUCCESSFUL'));
          success?.();
        } else {
          messageInstance.error(intl.get(data.msg).d(data.msg));
        }
      }
    } catch (error) {
      console.log(error);
      messageInstance.error(intl.get('server.error'));
    }
  };
  return { loading, handleSubmit };
};

const useUpdate = () => useRequest(updateAsset, { manual: true });

const updateAsset = async (id: number, asset: AssetModel) => {
  const { data } = await request.put(`/assets/${id}`, asset);
  return data;
};
