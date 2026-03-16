import { CharacteristicData } from 'common';

export enum DeviceType {
  Gateway = 0x1,
  Gateway4G = 0x2,
  GatewayWIFI = 0x3,
  GatewayLora = 0x5,
  GatewayDual4G = 0x6,
  Gateway5G = 0x7,
  GatewayGS280 = 0x9,
  Router = 0x101,
  SA = 0x20001,
  SA_S = 0x20101,
  SAS = 0x30001,
  DS4 = 0x30003,
  DS8 = 0x30004,
  SAS120D = 0x30005,
  SAS120Q = 0x30006,
  DC110 = 0x40001,
  DC110C = 0x40003,
  DC210 = 0x40101,
  DC210C = 0x40102,
  DC110H = 0x40104,
  DC110HC = 0x40105,
  DC110HL = 0x40107,
  DC210L = 0x40106,
  DC110L = 0x40201,
  SVT220520P = 0x50104,
  SVT520C = 0x50106,
  SVT210510P = 0x50107,
  SVT510C = 0x50108,
  SVT210K = 0x50109,
  SVT210A = 0x50112,
  SVT210S = 0x50202,
  SVT220S1 = 0x50203,
  SVT220S3 = 0x50204,
  SVT510L = 0x5010e,
  SVT210SU = 0x50210,
  ST100 = 0x60001,
  ST101S = 0x60101,
  ST101L = 0x60201,
  SPT510 = 0x80002,
  SQ100 = 0x90001,
  SQ110C = 0x90003,
  PressureGuoDa = 0x1000001,
  PressureWoErKe = 0x1000002,
  OilFiller = 0x08100001,
  SASLoraWAN = 0x40030001,
  DC210LoraWAN = 0x40040106,
  DC110HLoraWAN = 0x40040107,
  DC110LoraWAN = 0x40040201,
  SVT510LoraWAN = 0x4005010e,
  STLoraWAN = 0x40060201
}

export namespace DeviceType {
  export function toString(type: DeviceType) {
    switch (type) {
      case DeviceType.Gateway:
        return 'device.type.gateway';
      case DeviceType.Gateway4G:
        return 'device.type.gateway.4g';
      case DeviceType.GatewayWIFI:
        return 'device.type.gateway.wifi';
      case DeviceType.GatewayLora:
        return 'device.type.gateway.lora';
      case DeviceType.GatewayDual4G:
        return 'device.type.gateway.dual.4g';
      case DeviceType.Gateway5G:
        return 'device.type.gateway.5g';
      case DeviceType.GatewayGS280:
        return 'device.type.gateway.gs280';
      case DeviceType.Router:
        return 'device.type.relay';
      case DeviceType.SA:
        return 'device.type.sa';
      case DeviceType.SA_S:
        return 'device.type.sa-s';
      case DeviceType.SAS:
        return 'device.type.sas';
      case DeviceType.DS4:
        return 'device.type.ds4';
      case DeviceType.DS8:
        return 'device.type.ds8';
      case DeviceType.SAS120D:
        return 'device.type.sas120d';
      case DeviceType.SAS120Q:
        return 'device.type.sas120q';
      case DeviceType.DC110:
        return 'device.type.dc110';
      case DeviceType.DC110C:
        return 'device.type.dc110c';
      case DeviceType.DC210:
        return 'device.type.dc210';
      case DeviceType.DC210C:
        return 'device.type.dc210c';
      case DeviceType.DC110H:
        return 'device.type.dc110h';
      case DeviceType.DC110HC:
        return 'device.type.dc110hc';
      case DeviceType.DC110HL:
        return 'device.type.dc110hl';
      case DeviceType.DC210L:
        return 'device.type.dc210l';
      case DeviceType.DC110L:
        return 'device.type.dc110l';
      case DeviceType.SVT220520P:
        return 'device.type.svt220520p';
      case DeviceType.SVT520C:
        return 'device.type.svt520c';
      case DeviceType.SVT210510P:
        return 'device.type.svt210510p';
      case DeviceType.SVT510C:
        return 'device.type.svt510c';
      case DeviceType.SVT210K:
        return 'device.type.svt210k';
      case DeviceType.SVT210A:
        return 'device.type.svt210a';
      case DeviceType.SVT210S:
        return 'device.type.svt210s';
      case DeviceType.SVT220S1:
        return 'device.type.svt220s1';
      case DeviceType.SVT220S3:
        return 'device.type.svt220s3';
      case DeviceType.SVT510L:
        return 'device.type.svt510l';
      case DeviceType.SVT210SU:
        return 'device.type.svt210su';
      case DeviceType.ST100:
        return 'device.type.st100';
      case DeviceType.ST101S:
        return 'device.type.st101s';
      case DeviceType.ST101L:
        return 'device.type.st101l';
      case DeviceType.SPT510:
        return 'device.type.spt510';
      case DeviceType.SQ100:
        return 'device.type.sq100';
      case DeviceType.SQ110C:
        return 'device.type.sq110c';
      case DeviceType.PressureGuoDa:
        return 'device.type.guoda.pressure';
      case DeviceType.PressureWoErKe:
        return 'device.type.woerke.pressure';
      case DeviceType.OilFiller:
        return 'device.type.oil.filler';
      case DeviceType.SASLoraWAN:
        return 'device.type.saslw';
      case DeviceType.DC210LoraWAN:
        return 'device.type.dc210lw';
      case DeviceType.DC110HLoraWAN:
        return 'device.type.dc110hlw';
      case DeviceType.DC110LoraWAN:
        return 'device.type.dc110lw';
      case DeviceType.SVT510LoraWAN:
        return 'device.type.svt510lw';
      case DeviceType.STLoraWAN:
        return 'device.type.stlw';
      default:
        return 'device.type.unknown';
    }
  }

  const BLE_gateways = [
    DeviceType.Gateway,
    DeviceType.Gateway4G,
    DeviceType.GatewayWIFI,
    DeviceType.GatewayDual4G,
    DeviceType.Gateway5G
  ];

  export function getGateways() {
    return [...BLE_gateways, DeviceType.GatewayLora, DeviceType.GatewayGS280];
  }

  export function isGateway(type: number) {
    return getGateways().includes(type);
  }

  export function isBLEGateway(type: number) {
    return BLE_gateways.includes(type);
  }

  export function getRouters() {
    return [DeviceType.Router];
  }

  export function getNormalDCSensors() {
    return [DeviceType.DC110, DeviceType.DC110C, DeviceType.DC110L, DeviceType.DC110LoraWAN];
  }

  export function getHighDCSensors() {
    return [DeviceType.DC110H, DeviceType.DC110HC, DeviceType.DC110HL, DeviceType.DC110HLoraWAN];
  }

  export function getUltraHighDCSensors() {
    return [DeviceType.DC210, DeviceType.DC210C, DeviceType.DC210L, DeviceType.DC210LoraWAN];
  }

  export function getDCSensors() {
    return getNormalDCSensors().concat(getHighDCSensors()).concat(getUltraHighDCSensors());
  }

  export function sensors() {
    return [
      DeviceType.SA,
      DeviceType.SA_S,
      DeviceType.SAS,
      DeviceType.SASLoraWAN,
      DeviceType.DS4,
      DeviceType.DS8,
      DeviceType.SAS120D,
      DeviceType.SAS120Q,
      ...getDCSensors(),
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT510L,
      DeviceType.SVT510LoraWAN,
      DeviceType.SVT210K,
      DeviceType.SVT210A,
      DeviceType.SVT210S,
      DeviceType.SVT220S1,
      DeviceType.SVT220S3,
      DeviceType.SVT210SU,
      DeviceType.ST100,
      DeviceType.ST101L,
      DeviceType.STLoraWAN,
      DeviceType.ST101S,
      DeviceType.PressureGuoDa,
      DeviceType.PressureWoErKe,
      DeviceType.OilFiller,
      DeviceType.SPT510,
      DeviceType.SQ100,
      DeviceType.SQ110C
    ];
  }

  export function isMultiChannel(type: number) {
    return type === DeviceType.DS4 || type === DeviceType.DS8;
  }

  export function isSASMultiChannel(type: number) {
    return type === DeviceType.SAS120D || type === DeviceType.SAS120Q;
  }

  export function getChannels(type: number) {
    const channels = [1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({ label: v.toString(), value: v }));
    switch (type) {
      case DeviceType.SAS120D:
        return channels.slice(0, 2);
      case DeviceType.SAS120Q:
      case DeviceType.DS4:
        return channels.slice(0, 4);
      case DeviceType.DS8:
        return channels.slice();
      default:
        return [];
    }
  }

  export function isWiredSensor(type: number) {
    return (
      type === DeviceType.SA_S ||
      isMultiChannel(type) ||
      type === DeviceType.SVT210S ||
      type === DeviceType.SVT220S1 ||
      type === DeviceType.SVT220S3 ||
      type === DeviceType.ST101S ||
      type === DeviceType.SVT210SU
    );
  }

  export function isWiredDevice(type: number) {
    return isGateway(type) || isWiredSensor(type);
  }

  export function isSPT(type: number) {
    return type === DeviceType.SPT510;
  }

  export function hasDeviceSettings(type: number) {
    return type !== DeviceType.Router;
  }

  export function isRootDevice(type: number) {
    return isGateway(type) || isMultiChannel(type) || isCat1(type) || isLoraWAN(type);
  }

  export function isRootSensor(type: number) {
    return isMultiChannel(type) || isCat1(type);
  }

  export function isSensor(type: number) {
    return sensors().includes(type);
  }

  function isCat1(type: number) {
    return (
      type === DeviceType.DC110C ||
      type === DeviceType.DC210C ||
      type === DeviceType.DC110HC ||
      type === DeviceType.SVT520C ||
      type === DeviceType.SVT510C ||
      type === DeviceType.SQ110C
    );
  }

  export function canSupportingCalibrate(type: number) {
    return (
      type === DeviceType.SAS ||
      type === DeviceType.SASLoraWAN ||
      DeviceType.isSASMultiChannel(type) ||
      DeviceType.isMultiChannel(type) ||
      getDCSensors().includes(type) ||
      type === DeviceType.PressureGuoDa ||
      type === DeviceType.PressureWoErKe ||
      type === DeviceType.SPT510 ||
      DeviceType.isVibration(type)
    );
  }

  export function canSupportingCompensation(type: number) {
    return (
      getDCSensors().includes(type) || type === DeviceType.SAS || type === DeviceType.SASLoraWAN
    );
  }

  export function isVibration(type: DeviceType | undefined) {
    switch (type) {
      case DeviceType.SVT220520P:
      case DeviceType.SVT520C:
      case DeviceType.SVT210510P:
      case DeviceType.SVT510C:
      case DeviceType.SVT210K:
      case DeviceType.SVT210A:
      case DeviceType.SVT210S:
      case DeviceType.SVT220S1:
      case DeviceType.SVT220S3:
      case DeviceType.SVT510L:
      case DeviceType.SVT510LoraWAN:
      case DeviceType.SVT210SU:
        return true;
    }
    return false;
  }

  export function vibrationSensors() {
    return [
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT210K,
      DeviceType.SVT210A,
      DeviceType.SVT210S,
      DeviceType.SVT220S1,
      DeviceType.SVT220S3,
      DeviceType.SVT510L,
      DeviceType.SVT510LoraWAN,
      DeviceType.SVT210SU
    ];
  }

  export function isSVTLora(type: number) {
    return type === DeviceType.SVT510L;
  }

  export function isLoraWAN(type: number) {
    return (
      type === DeviceType.SASLoraWAN ||
      type === DeviceType.DC110LoraWAN ||
      type === DeviceType.DC210LoraWAN ||
      type === DeviceType.DC110HLoraWAN ||
      type === DeviceType.SVT510LoraWAN ||
      type === DeviceType.STLoraWAN
    );
  }
}

export const SENSOR_DISPLAY_PROPERTIES = {
  [DeviceType.SA]: CharacteristicData.CATEGORIES.SA,
  [DeviceType.SA_S]: CharacteristicData.CATEGORIES.SA,
  [DeviceType.SAS]: CharacteristicData.CATEGORIES.SAS,
  [DeviceType.SASLoraWAN]: CharacteristicData.CATEGORIES.SAS,
  [DeviceType.SAS120D]: CharacteristicData.CATEGORIES.SAS,
  [DeviceType.SAS120Q]: CharacteristicData.CATEGORIES.SAS,
  [DeviceType.DS4]: CharacteristicData.CATEGORIES.DS,
  [DeviceType.DS8]: CharacteristicData.CATEGORIES.DS,
  [DeviceType.DC110]: CharacteristicData.CATEGORIES.DC_NORMAL,
  [DeviceType.DC110C]: CharacteristicData.CATEGORIES.DC_NORMAL,
  [DeviceType.DC110L]: CharacteristicData.CATEGORIES.DC_NORMAL,
  [DeviceType.DC110H]: CharacteristicData.CATEGORIES.DC_HIGH,
  [DeviceType.DC110HC]: CharacteristicData.CATEGORIES.DC_HIGH,
  [DeviceType.DC110HL]: CharacteristicData.CATEGORIES.DC_HIGH,
  [DeviceType.DC210L]: CharacteristicData.CATEGORIES.DC_Ultra_HIGH,
  [DeviceType.DC210]: CharacteristicData.CATEGORIES.DC_Ultra_HIGH,
  [DeviceType.DC210C]: CharacteristicData.CATEGORIES.DC_Ultra_HIGH,
  [DeviceType.SVT220520P]: CharacteristicData.CATEGORIES.SVT220520P,
  [DeviceType.SVT520C]: CharacteristicData.CATEGORIES.SVT220520P,
  [DeviceType.SVT210510P]: CharacteristicData.CATEGORIES.SVT210510P,
  [DeviceType.SVT510C]: CharacteristicData.CATEGORIES.SVT210510P,
  [DeviceType.SVT210K]: CharacteristicData.CATEGORIES.SVT210K,
  [DeviceType.SVT210A]: CharacteristicData.CATEGORIES.SVT210A,
  [DeviceType.SVT210S]: CharacteristicData.CATEGORIES.SVT220S1S3,
  [DeviceType.SVT220S1]: CharacteristicData.CATEGORIES.SVT220S1S3,
  [DeviceType.SVT220S3]: CharacteristicData.CATEGORIES.SVT220S1S3,
  [DeviceType.SVT510L]: CharacteristicData.CATEGORIES.SVT220S1S3,
  [DeviceType.SVT210SU]: CharacteristicData.CATEGORIES.SVT210SU,
  [DeviceType.ST100]: CharacteristicData.CATEGORIES.ST,
  [DeviceType.ST101S]: CharacteristicData.CATEGORIES.ST,
  [DeviceType.ST101L]: CharacteristicData.CATEGORIES.ST,
  [DeviceType.OilFiller]: CharacteristicData.CATEGORIES.OilFiller,
  [DeviceType.SPT510]: CharacteristicData.CATEGORIES.SPT,
  [DeviceType.SQ100]: CharacteristicData.CATEGORIES.SQ,
  [DeviceType.SQ110C]: CharacteristicData.CATEGORIES.SQ
};

const SVT_SENSOR_TYPES = [16842753, 16842758, 16842759];

export const SVT_DEVICE_TYPE_SENSOR_TYPE_MAPPING = {
  [DeviceType.SVT220520P]: SVT_SENSOR_TYPES[1],
  [DeviceType.SVT520C]: SVT_SENSOR_TYPES[1],
  [DeviceType.SVT210510P]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT510C]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT210K]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT210A]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT210S]: SVT_SENSOR_TYPES[0],
  [DeviceType.SVT220S1]: SVT_SENSOR_TYPES[2],
  [DeviceType.SVT220S3]: SVT_SENSOR_TYPES[1],
  [DeviceType.SVT510L]: SVT_SENSOR_TYPES[1],
  [DeviceType.SVT210SU]: SVT_SENSOR_TYPES[0]
};
