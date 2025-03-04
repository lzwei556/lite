export enum MonitoringPointTypeValue {
  BoltLoosening = 10101,
  Corrosion = 10201,
  HighTemperatureCorrosion = 10202,
  LowTemperatureCorrosion = 10203,
  BoltPreload = 10301,
  AnchorPreload = 10303,
  FlangeBoltPreload = 10311,
  FlangeAnchorPreload = 10312,
  Vibration = 10401,
  VibrationRotationSingleAxis = 10402,
  VibrationRotation = 10403,
  Inclination = 10501,
  TopInclination = 10511,
  BaseInclination = 10512,
  Pressure = 10602,
  Temperature = 10801
}

export enum MonitoringPointTypeText {
  BoltLoosening = 'monitoring.point.type.bolt.loosening',
  Corrosion = 'monitoring.point.type.corrosion',
  HighTemperatureCorrosion = 'monitoring.point.type.high.temperature.corrosion',
  LowTemperatureCorrosion = 'monitoring.point.type.low.temperature.corrosion',
  BoltPreload = 'monitoring.point.type.bolt.preload',
  AnchorPreload = 'monitoring.point.type.anchor.preload',
  FlangeBoltPreload = 'monitoring.point.type.flange.bolt.preload',
  FlangeAnchorPreload = 'monitoring.point.type.flange.anchor.preload',
  Vibration = 'monitoring.point.type.vibration',
  VibrationRotationSingleAxis = 'monitoring.point.type.vibration.rotation.single.axis',
  VibrationRotation = 'monitoring.point.type.vibration.rotation',
  Inclination = 'monitoring.point.type.inclination',
  TopInclination = 'monitoring.point.type.top.inclination',
  BaseInclination = 'monitoring.point.type.base.inclination',
  Pressure = 'monitoring.point.type.pressure',
  Temperature = 'monitoring.point.type.temperature'
}
