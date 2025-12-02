export type DeviceCategory = 'gateway' | 'sensor' | 'relay';
export type DeviceProtocol = 'Bluetooth' | 'Cat.1' | 'LoRa' | 'RS485';
export type SensorSeries =
  | 'vibration'
  | 'corrosion'
  | 'temperature'
  | 'pressure'
  | 'flow'
  | 'multi-sensor';

export interface DeviceCommand {
  id: string;
  label: string;
  parameters?: Array<{
    id: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'enum';
    options?: string[];
  }>;
}

export const COMMON_COMMANDS = {
  reset: { id: 'reset', label: 'Reset' },
  restart: { id: 'restart', label: 'Restart' },
  upgradeFirmware: { id: 'upgrade_firmware', label: 'Upgrade Firmware' }
} as const;

export const GATEWAY_COMMANDS = {
  ...COMMON_COMMANDS,
  syncTime: { id: 'sync_time', label: 'Sync Time' }
} as const;

export const SENSOR_COMMANDS = {
  ...COMMON_COMMANDS,
  calibrate: { id: 'calibrate', label: 'Calibrate' },
  startMeasurement: { id: 'start_measurement', label: 'Start Measurement' },
  stopMeasurement: { id: 'stop_measurement', label: 'Stop Measurement' },
  readValue: { id: 'read_value', label: 'Read Value' }
} as const;

export const RELAY_COMMANDS = {
  ...COMMON_COMMANDS,
  turnOn: { id: 'turn_on', label: 'Turn On' },
  turnOff: { id: 'turn_off', label: 'Turn Off' },
  toggle: { id: 'toggle', label: 'Toggle' }
} as const;

// command Type Mappings
export type GatewayCommand = (typeof GATEWAY_COMMANDS)[keyof typeof GATEWAY_COMMANDS];
export type SensorCommand = (typeof SENSOR_COMMANDS)[keyof typeof SENSOR_COMMANDS];
export type RelayCommand = (typeof RELAY_COMMANDS)[keyof typeof RELAY_COMMANDS];

export interface DeviceSetting {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  defaultValue?: any;
  options?: string[];
}

// --- Category-specific required settings ---
export const CATEGORY_SETTINGS = {
  gateway: [{ id: 'frequency', label: 'Frequency (MHz)', type: 'number', defaultValue: 868 }],
  sensor: [
    { id: 'report_interval', label: 'Report Interval (s)', type: 'number', defaultValue: 60 }
  ],
  relay: [
    {
      id: 'initial_state',
      label: 'Initial State',
      type: 'enum',
      options: ['on', 'off'],
      defaultValue: 'off'
    }
  ]
} as const;

// --- Protocol-specific required settings ---
export const PROTOCOL_SETTINGS = {
  LoRa: [{ id: 'bandwidth', label: 'Bandwidth (kHz)', type: 'number', defaultValue: 125 }],
  RS485: [
    {
      id: 'baud_rate',
      label: 'Baud Rate',
      type: 'enum',
      options: ['9600', '19200'],
      defaultValue: '9600'
    },
    { id: 'address', label: 'Modbus Address', type: 'number', defaultValue: 1 }
  ],
  Bluetooth: [
    {
      id: 'pairing_mode',
      label: 'Pairing Mode',
      type: 'enum',
      options: ['manual', 'auto'],
      defaultValue: 'auto'
    }
  ],
  'Cat.1': [{ id: 'apn', label: 'APN', type: 'string', defaultValue: 'internet' }]
} as const;

// Generic rule-based device type
export type BaseDeviceType<
  C extends DeviceCategory,
  P extends DeviceProtocol,
  Cmd,
  Extra extends object = {}
> = {
  id: number;
  name: string;
  categories: [C];
  protocol: P;
  settings: (
    | (typeof CATEGORY_SETTINGS)[C][number]
    | (typeof PROTOCOL_SETTINGS)[P][number]
    | DeviceSetting
  )[]; // rule 4: settings per category or protocol
  commands: Cmd[];
} & Extra;

export type SensorDeviceType = BaseDeviceType<
  'sensor',
  DeviceProtocol,
  SensorCommand, // rule 3: valid command sets per category
  { series: SensorSeries[] } // rule 2: only sensors can have series
>;

export type GatewayDeviceType = BaseDeviceType<'gateway', DeviceProtocol, GatewayCommand>;

export type RelayDeviceType = BaseDeviceType<'relay', DeviceProtocol, RelayCommand>;

export type DeviceType = SensorDeviceType | GatewayDeviceType | RelayDeviceType; // rule 1: valid categories per device
