import { ResponseResult } from '../types/response';
import { message } from 'antd';
import { AxiosResponse } from 'axios';
import { Translation } from 'locales/utils';

export function GetResponse<T>(response: AxiosResponse<ResponseResult<T>>) {
  return new Promise<T>((resolve, reject) => {
    if (response.data.code === 200) {
      resolve(response.data.data);
    } else {
      message.error(
        `${Translation.failureDo('common.action.fetch')} ${Translation.get(response.data.msg)}`
      );
      reject(response.data.msg);
    }
  });
}

export function PostResponse<T>(response: AxiosResponse<ResponseResult<T>>) {
  return new Promise<T>((resolve, reject) => {
    if (response.data.code === 200) {
      message.success(Translation.get('feedback.success.create'));
      resolve(response.data.data);
    } else {
      message.error(
        `${Translation.failureDo('common.action.create')} ${Translation.get(response.data.msg)}`
      );
      reject(response.data.msg);
    }
  });
}

export function PutResponse(response: AxiosResponse<ResponseResult<any>>) {
  return new Promise((resolve, reject) => {
    if (response.data.code === 200) {
      message.success(Translation.get('feedback.success.update'));
      resolve(response.data.data);
    } else {
      message.error(
        `${Translation.failureDo('common.action.update')} ${Translation.get(response.data.msg)}`
      );
      reject(response.data.msg);
    }
  });
}

export function HandlePutResponse<T>(response: AxiosResponse<ResponseResult<T>>) {
  return new Promise<T>((resolve, reject) => {
    if (response.data.code === 200) {
      resolve(response.data.data);
    } else {
      reject(response.data.msg);
    }
  });
}

export function DeleteResponse(response: AxiosResponse<ResponseResult<any>>) {
  return new Promise((resolve, reject) => {
    if (response.data.code === 200) {
      message.success(Translation.get('feedback.success.delete'));
      resolve(response.data.data);
    } else {
      message.error(
        `${Translation.failureDo('common.action.delete')} ${Translation.get(response.data.msg)}`
      );
      reject(response.data.msg);
    }
  });
}
