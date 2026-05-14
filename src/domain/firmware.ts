import { Field } from 'types';
import { PageParameter, PageResult } from 'types/page';
import { Dayjs } from 'utils';
import request from 'utils/request';

export type DTO = {
  id: number;
  name: string;
  version: string;
  crc: string;
  productId: number;
  buildTime: number;
};

export type Firmware = DTO & {
  buildTimeText: string;
};

const transform = (dto: DTO): Firmware => {
  return { ...dto, buildTimeText: Dayjs.format(dto.buildTime) };
};

export const getList = async (param: PageParameter): Promise<PageResult<Firmware>> => {
  const data = await request.get<PageResult<DTO>>('/firmwares', param);
  return { ...data, result: data.result.map(transform) };
};

export const deleteOne = async ({ id }: { id: number }) => {
  return request.delete(`/firmwares/${id}`);
};

export const upload = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.upload('/firmwares', formData);
};

export const getListByDeviceId = async ({ id }: { id: number }) => {
  const dtos = await request.get<DTO[]>(`/devices/${id}/firmwares`);
  return dtos.map(transform);
};

export const Fields = {
  Name: { name: 'name', label: 'NAME' } as Field<Firmware>,
  Version: { name: 'version', label: 'SOFTWARE_VERSION' } as Field<Firmware>,
  ProductId: { name: 'productId', label: 'HARDWARE_VERSION' } as Field<Firmware>,
  Crc: { name: 'crc', label: 'CRC' } as Field<Firmware>,
  BuildTime: { name: 'buildTimeText', label: 'BUILD_DATE' } as Field<Firmware>
};
