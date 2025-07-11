type WSN = {
  provisioning_mode: number;
  communication_period: number;
  communication_period_2: number;
  communication_offset: number;
  group_size: number;
  group_size_2: number;
  interval_cnt: number;
};

enum ProvisioningMode {
  Group = 1,
  TimeDivision,
  Continuous,
  ManagedBroadcast,
  UnManagedBroadcast
}
