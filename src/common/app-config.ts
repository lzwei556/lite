import { AssetCategory } from './asset-category';

type AppType =
  | 'bolt'
  | 'bridgeBolt'
  | 'corrosion'
  | 'corrosionWirelessHART'
  | 'general'
  | 'hydroTurbine'
  | 'pressure'
  | 'railBolt'
  | 'temperature'
  | 'towerBolt'
  | 'vibration'
  | 'windTurbine'
  | 'windTurbinePro';

type Config = {
  siteName: string;
  folderAssetCategories: number[];
};

const general = {
  siteName: 'IOT_CLOUD_MONITORING_SYSTEM',
  folderAssetCategories: [AssetCategory.Value.Area]
};
const corrosion = {
  siteName: 'CORROSION_MONITORING_SYSTEM',
  folderAssetCategories: general.folderAssetCategories
};
const windTurbine = {
  siteName: 'WIND_TURBINE_BOLT_MONITORING_SYSTEM',
  folderAssetCategories: [AssetCategory.Value.WindTurbine]
};

const configsTable: Record<AppType, Config> = {
  bolt: general,
  bridgeBolt: general,
  corrosion,
  corrosionWirelessHART: corrosion,
  general,
  hydroTurbine: {
    siteName: 'HYDRO_TURBINE_BOLT_MONITORING_SYSTEM',
    folderAssetCategories: windTurbine.folderAssetCategories
  },
  pressure: general,
  railBolt: general,
  temperature: general,
  towerBolt: general,
  vibration: general,
  windTurbine,
  windTurbinePro: windTurbine
};
