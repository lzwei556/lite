import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { ResponseResult } from '../types/response';
import { message } from 'antd';
import { Dayjs, GlobalStore } from '../utils';
import { getAuthToken } from '../providers/auth';

axios.defaults.timeout = 30 * 1000;
axios.defaults.baseURL = '/api';

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    const store = GlobalStore.getInstance(true);
    const selectedProjectId = store.get('selectedProjectId');
    if (selectedProjectId) {
      config.headers.Project = selectedProjectId;
    }
    config.headers.Timezone = Dayjs.dayjs.tz.guess();
  }
  return config;
});

axios.interceptors.response.use(
  <T>(response: AxiosResponse<ResponseResult<T>>) => {
    const res = response.data;
    if (res?.code !== 200) {
      const error = new Error(res.msg || 'request.failed') as any;
      error.code = res.code;
      return Promise.reject(error);
    }
    return res.data;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 400) {
      message.error('400');
    }
    if (status === 401) {
      //logout()
    }
    if (status === 403) {
      message.error('403');
    }
    if (status >= 500) {
      message.error('500');
    }
    return Promise.reject(error);
  }
);

async function request<T>(method: Method, url: string, params: any) {
  if (params) {
    params = filterNull(params);
  }
  return await axios.request<any, T>({
    url: url,
    data:
      method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
        ? params
        : null,
    params: method === 'GET' ? params : null,
    method: method
  });
}

function download<T>(method: Method, url: string, params: any) {
  if (params) {
    params = filterNull(params);
  }
  return new Promise<AxiosResponse<T>>((resolve, reject) => {
    axios
      .request({
        url: url,
        data: method === 'POST' || method === 'PUT' || method === 'PATCH' ? params : null,
        params: method === 'GET' ? params : null,
        method: method,
        responseType: 'blob'
      })
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
}

function upload<T>(url: string, params: any) {
  if (params) {
    params = filterNull(params);
  }
  return new Promise<AxiosResponse<T>>((resolve, reject) => {
    axios
      .request({
        url: url,
        data: params,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  });
}

function typeOf(t: any) {
  const matcher = {}.toString.call(t).match(/\s([a-zA-Z]+)/);
  if (matcher && matcher.length >= 2) {
    return matcher[1].toLowerCase();
  }
}

function filterNull(params: any) {
  if (params) {
    Object.keys(params).forEach((key) => {
      if (params[key] === null) {
        delete params[key];
      } else if (typeOf(params[key]) === 'string') {
        params[key] = params[key].trim();
      } else if (typeOf(params[key] === 'object')) {
        params[key] = filterNull(params[key]);
      } else if (typeOf(params[key] === 'array')) {
        params[key] = filterNull(params[key]);
      }
    });
  }
  return params;
}

// eslint-disable-next-line
export default {
  axios,
  download: <T>(url: string, params: any = null) => {
    return download<T>('GET', url, params);
  },
  upload: <T>(url: string, params: any) => {
    return upload<T>(url, params);
  },
  get: <T>(url: string, params: any = null) => {
    return request<T>('GET', url, params);
  },
  post: <T>(url: string, params: any) => {
    return request<T>('POST', url, params);
  },
  put: <T>(url: string, params: any) => {
    return request<T>('PUT', url, params);
  },
  patch: <T>(url: string, params: any) => {
    return request<T>('PATCH', url, params);
  },
  delete: <T>(url: string, params: any = null) => {
    return request<T>('DELETE', url, params);
  }
};
